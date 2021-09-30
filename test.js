let { c, body, addCSS, on, Class, id } = require("./labyrinth");

addCSS(`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
* {
    font-family: 'Roboto', sans-serif;
    color: #f8f9fa;
}
h1 {
    font-size: 3em;
}
p {
    font-size: 1.5em;
}
a {
    color: #24c99a;
}
body {
    background: #212529;
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
}
button {
    margin: 2px;
}
#a {
    color: #212529;
    background: #fdc02f;
    border: 0;
    border-radius: 4px;
    font-size: 1.5em;
    padding: 4px 12px 4px 12px;
    transition: background 0.1s;
}
#a:hover {
    background: #ca9924;
}
.b {
    background: #2b71f9;
    border: 0;
    border-radius: 4px;
    font-size: 1.5em;
    padding: 4px 12px 4px 12px;
    transition: background 0.1s ease-in-out;
}
.b:hover {
    background: #215ac7;
}`);

body.new("h1", "Tests:");

body.new("p", "<a>✔</a> body.new(...)");
body.add(c("p", "<a>✔</a> body.add(c(...))"));
body.new("p", "<a>✔</a> addCSS(...)");

body.new(
	"button",
	"test button",
	id("a"),
	on("click", () =>
		body.new(
			"button",
			"test button <a>✔</a>",
			Class("b"),
			on("click", (ev, elem) => elem.remove())
		)
	)
);
