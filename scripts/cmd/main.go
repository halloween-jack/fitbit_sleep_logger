package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"golang.org/x/oauth2"
)

var (
	config   *oauth2.Config
	verifier string
)

func main() {
	clientID := os.Getenv("CLIENT_ID")
	clientSecret := os.Getenv("CLIENT_SECRET")
	ngrokDomain := os.Getenv("NGROK_DOMAIN")

	config = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://www.fitbit.com/oauth2/authorize",
			TokenURL: "https://api.fitbit.com/oauth2/token",
		},
		RedirectURL: fmt.Sprintf("https://%s/auth/callback", ngrokDomain),
		Scopes:      []string{"sleep", "activity", "heartrate", "nutrition", "profile", "settings", "weight"},
	}

	verifier = oauth2.GenerateVerifier()

	url := config.AuthCodeURL("state", oauth2.AccessTypeOffline, oauth2.S256ChallengeOption(verifier))

	fmt.Printf("Click here for the authorization url: %v\n", url)

	listener, err := net.Listen("tcp", ":3000")
	if err != nil {
		log.Fatal(err)
	}
	defer listener.Close()

	c, err := listener.Accept()
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()

	handleConnection(c)
}

type Credentials struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int64  `json:"expiresIn"`
}

func handleConnection(c net.Conn) {
	r, err := http.ReadRequest(bufio.NewReader(c))
	if err != nil {
		log.Fatal(err)
	}

	code := r.URL.Query().Get("code")
	token, err := config.Exchange(context.Background(), code, oauth2.VerifierOption((verifier)))
	if err != nil {
		log.Fatal(err)
	}

	cr := Credentials{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.Expiry.UTC().Unix(),
	}

	bytes, err := json.Marshal(cr)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s", bytes)

	response := http.Response{
		StatusCode: 200,
		ProtoMajor: 1,
		ProtoMinor: 0,
		Body:       io.NopCloser(strings.NewReader("success!, back to terminal.")),
	}
	response.Write(c)
	c.Close()
}
