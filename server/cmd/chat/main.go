package main

import (
	"fmt"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
)

func main() {
	paginato := paginator.NewPaginator()
	data := paginator.ObjectPaginator{}
	paginato.STable(models.UsersTable).SOrder("a=desc|b=asc").SAcceptedFilter([]string{"a", "b"}).Pick(map[string][]string{
		"page":  {"32"},
		"limit": {"2"},
		"a":     {"aba"},
		"b":     {"bababab", "baababa"},
		"c":     {"zxc"},
		"d":     {"zxca123"},
		"e":     {"ad", "ad2"},
	}).Ignite(&data)
	fmt.Println(&data)
}
