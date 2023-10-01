FROM golang:1.21

COPY ./backend/go.mod /go/src/github.com/YahiroRyo/storage/backend/go.mod
COPY ./backend/go.sum /go/src/github.com/YahiroRyo/storage/backend/go.sum
RUN cd /go/src/github.com/YahiroRyo/storage/backend/ && go mod download

RUN go install github.com/cosmtrek/air@v1.29.0
RUN go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest

COPY backend /go/src/github.com/YahiroRyo/storage/backend
