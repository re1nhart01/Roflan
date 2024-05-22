package main

import qrcode "github.com/skip2/go-qrcode"

func main() {
	err := qrcode.WriteFile("https://t.me/RoflanAppbot", qrcode.Medium, 1024, "qr.png")
	if err != nil {
		panic(err)
	}
}
