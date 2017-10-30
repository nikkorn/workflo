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
        wrapper.innerHTML = this._getTemplateFunction(options.definition || {})(this);

        // If an onclick callback was defined in the options then hook it up to a press of the wrapped div.
        if (options.onclick && typeof options.onclick === "function")
        {
            wrapper.addEventListener("click", function () { options.onclick(item); });
        }

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

        var offsetTop = 0;
        var points    = [];

        // Draw a connector for each child of this node.
        for (var i = 0; i < this.children.length; i++)
        {
            // Get the current child.
            var child = this.children[i];

            // Get the height of the child.
            var childHeight = child.getHeight();

            // Calculate the end point of the connector, which should be aligned with the child element.
            var childConnectorOffset = offsetTop + (childHeight / 2);

            points.push(((childConnectorOffset / this.getHeight()) * 100) + "%");

            // Add the child height to the offset.
            offsetTop += childHeight;
        }

        populateConnectorSVG(this._connectorSVG, points, options.line || {});
    }

    /**
     * Get the height of this node in the DOM.
     */
    this.getHeight = function () { return this._parentContainer ? this._parentContainer.offsetHeight : 0; }

    /**
     * Returns whether this is a root node.
     */
    this.isRoot = function () { return !this.parent();  }

    /**
     * Get the template function to use for creating the node element.
     */
    this._getTemplateFunction = function (definition) 
    { 
        // Firstly, attempt to find a template function based on the node type.
        var idValue      = this.id();
        var typeValue    = this.type();
        var matchingType = (definition.additional || []).find(function (definition) { return definition.type === typeValue; })

        if (matchingType && matchingType.template && typeof matchingType.template === "function")
        {
            return matchingType.template;
        } 
        else if (definition.default && definition.default.template && typeof definition.default.template === "function") 
        {
            return definition.default.template;
        } 
        else 
        {
            return function () { return "<div class='workflo-default-node'><p>" + idValue + "</p></div>" };
        }
    };
}