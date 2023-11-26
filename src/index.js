import { instance } from "@viz-js/viz";
import { parse } from "mathjs";

const input = document.getElementById('input_expr')
input.addEventListener("input", generate_tree);

function generate_tree() {
  const nodes = []
  const edges = []

  let expr_str = input.value;

  // Create AST
  let ast 
  try {
    ast = parse(expr_str);
  } catch (error) { 
    return
  }

  // Give indices to nodes for graph
  const indexed_ast = new Map();

  create_nodes(ast)
  create_edges(ast)

  var container = document.getElementById('ast');

  instance().then(viz => {
    container.innerHTML = "";
    container.appendChild(viz.renderSVGElement(
      {
        nodeAttributes: {
          shape: "rec"
        },
        nodes: nodes,
        edges: edges
      }))
  });

  function create_nodes(root) {
    let counter = 0;

    root.traverse(function (node, _path, _parent) {
      let label = "";
      switch (node.type) {
        case 'OperatorNode':
          label = node.op;
          break
        case 'ConstantNode':
          label = node.value.toString();
          break
        case 'SymbolNode':
          label = node.name;
          break
        case 'ParenthesisNode':
          label = "()";
          break
        default: 
      }

      nodes.push({name: counter, attributes: { label: label.length > 0 ? label : "unknown" }})
      indexed_ast.set(node, counter++)
    })
  }

  function create_edges(node) {
    switch (node.type) {
      case 'OperatorNode': case 'ParenthesisNode':
        node.forEach(function (child, _path, _parent) {
          edges.push({tail: indexed_ast.get(node), head: indexed_ast.get(child)})
          create_edges(child)
        })
        break
      case 'ConstantNode': case 'SymbolNode':
        break;
      default:
        console.log("unknown node type")
    }
  }
}