/**
 * A node.
 */
function Node (item, options) 
{
    // The node properties.
    this.id     = function () { return this.item[options.nodeIdField] };
    this.name   = function () { return this.item[options.nodeNameField] };
    this.type   = function () { return this.item[options.nodeTypeField] };
    this.parent = function () { return this.item[options.nodeParentField] };

    // The item backing the node.
    this.item = item;

    // The depth of the node in the node tree.
    this.depth = 1;

    // The children of this node.
    this.children = [];

    // The SVG on which to draw node connectors.
    this._connectorSVG;

    // The parent DOM element of this node.
    this._parentContainer;

    /**
     * Appends the node DOM element to a parent element.
     */
    this.attachToParentContainer = function (parent) 
    { 
        // Grab a reference to the parent container.
        this._parentContainer = parent;

        // Create a wrapper div for the element.
        var wrapper        = document.createElement("div"); 
        wrapper.className  = "template-wrapper";

        // Use the default template to create the element.
        // TODO Eventually deduce whether to use a specific template.
        wrapper.innerHTML = options.definition.default.template(this);

        // Create the SVG.
        this._connectorSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        // Set the inital attributes.
        this._connectorSVG.setAttributeNS(null, "class", "connector-svg");

        // Create a wrapper for the SVG. 
        var connectorSVGWrapper       = document.createElement("div"); 
        connectorSVGWrapper.className = "connector-svg-wrapper";
        connectorSVGWrapper.append(this._connectorSVG);

        // Append the node element to the target container.
        parent.append(wrapper);

        // Append the connectors SVG wrapper the the target container.
        parent.append(connectorSVGWrapper);
    }

    /**
     * Draw the parent -> child connectors for this node.
     */
    this.drawConnectors = function () { 

        var connectorSVG = this._connectorSVG;

        // Helper function to create a SVG line which represents a connector.
        var createConnector = function (x1, y1, x2, y2, color, w) {
            var connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            connector.setAttribute('x1', x1);
            connector.setAttribute('y1', y1);
            connector.setAttribute('x2', x2);
            connector.setAttribute('y2', y2);
            connector.setAttribute('stroke', color);
            connector.setAttribute('stroke-width', w);
            connectorSVG.appendChild(connector);
        }

        // Draw a connector for each child of this node.
        var offsetTop = 0;
        for (var i = 0; i < this.children.length; i++)
        {
            // Get the current child.
            var child = this.children[i];

            // Get the height of the child.
            var childHeight = child.getHeight();

            // Calculate the end point of the connector, which should be aligned with the child element.
            var childConnectorOffset = offsetTop + (childHeight / 2);

            // Create a connector for this child.
            createConnector(0, "50%", "100%", childConnectorOffset, 'rgb(0,0,0)', 2);

            // Add the child height to the offset.
            offsetTop += childHeight;
        }
    }

    /**
     * Get the height of this node in the DOM.
     */
    this.getHeight = function () { return this._parentContainer ? this._parentContainer.offsetHeight : 0; }

    /**
     * Returns whether this is a root node.
     */
    this.isRoot = function () { return !this.parent();  }
}