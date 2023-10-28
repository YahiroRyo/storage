package identify

import "github.com/bwmarrin/snowflake"

var node *snowflake.Node

func Generate() string {
	if node == nil {
		createdNode, err := snowflake.NewNode(1)
		if err != nil {
			panic(err)
		}

		node = createdNode
	}

	return node.Generate().String()
}
