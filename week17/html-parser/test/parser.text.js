import { parserHTML } from "../parser";

const assert = require("assert");

describe("parserHTML", function() {
  it("<a></a>", function() {
    const tree = parserHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href='www.baidu.com'></a>", function() {
    const tree = parserHTML('<a href="www.baidu.com"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  });

  it("<a href></a>", function() {
    const tree = parserHTML('<a href></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  });

  it("<a id=\'abc\'></a>", function() { 
    const tree = parserHTML("<a id=\'abc\'></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id=\"abc\"></a>", function() { 
    const tree = parserHTML("<a id=\"abc\"></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id=\"abc\" href></a>", function() { 
    const tree = parserHTML("<a id=\"abc\" ></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id=\"abc\" />", function() { 
    const tree = parserHTML("<a id=\"abc\" />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id=abc></a>", function() { 
    const tree = parserHTML("<a id=abc></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id=abc />", function() { 
    const tree = parserHTML("<a id=abc />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a id href/>", function() { 
    const tree = parserHTML("<a id href/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  } );

  it("<a />", function() {
    const tree = parserHTML("<a/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  });

  it("<A /> UPPER CASE", function() {
    const tree = parserHTML("<A />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0)
  });


  it(`<>`, function() {
    const tree = parserHTML(`<>`);
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, 'text');
  });
});
