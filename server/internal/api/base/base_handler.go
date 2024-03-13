package base

type IHandler interface {
	GetName() string
	GetPath() string
}

type Handler struct {
	Name string
	Path string
}
