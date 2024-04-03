package main

import (
	"fmt"
	"reflect"
)

func main() {
	fieldFromBody := 0
	v1 := reflect.ValueOf(fieldFromBody)
	//fmt.Println(v1.Type().String(), v1.Float())
	fv := v1.Convert(reflect.TypeOf(float64(0)))
	fmt.Println(fv.Type().String())
	fmt.Println(fv.Float())
}
