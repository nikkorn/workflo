(function() {
    "use strict";

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

		/**
		 * Appends the node DOM element to a parent element.
		 */
		this.appendNodeElementToParent = function (parent) 
		{ 
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
		 * Returns whether this is a root node.
		 */
		this.isRoot = function () { return !this.parent();  }
	}

	/**
	 * A node container.
	 */
	function NodeContainer () 
	{
		this.nodeContainer             = document.createElement("div");
		this.nodeContainer.className   = "node-container";
		this.parentContainer           = document.createElement("div");
		this.parentContainer.className = "parent-container";
		this.childContainer            = document.createElement("div");
		this.childContainer.className  = "child-container";
		this.nodeContainer.appendChild(this.parentContainer);
		this.nodeContainer.appendChild(this.childContainer);
	};

	function Workflo (target, options) 
	{
		// The default options.
		this._defaultOptions = {};

		// The target container.
		this._target = target;

		// The options.
		this._options = options;

		// The root nodes.
		this._rootNodes;

		// The node depth.
		this._nodeDepth;

		/**
		 * Initialisation.
		 */
		this._init = function () 
		{
			// Create the node tree.
			this._createNodeTree();

			// Create a node container for each node and its children.
			this._createNodeContainers();
		};

		this._createNodeTree = function () 
		{
			// Check that we have an id property.
			if (!this._options.nodeIdField)
			{
				throw "no id property was defined in options."
			}

			// Get the data items from the options.
			var dataItems = this._options.data;

			// Set the initial node depth.
			this._nodeDepth = 0;
			var that        = this;

			// A function to recursively create and append child nodes to a parent node.
			var createAndAppendChildNodes = function (parent, items, options)
			{
				// Look for any items which are a child of the parent node.
				for (var i = 0; i < items.length; i++)
				{
					// Get the current item.
					var item         = items[i];
					var itemParentId = item[options.nodeParentField];

					// If this items parent is the parent node then hook them up.
					if (itemParentId && itemParentId === parent.id())
					{
						// Create the child node.
						var childNode = new Node(item, options);

						// Set the depth of the node.
						childNode.depth = parent.depth + 1;

						// Is this the lowest depth we have seen?
						if (childNode.depth > that._nodeDepth)
						{
							that._nodeDepth = childNode.depth;
						}

						// Add the child node as a child of the parent.
						parent.children.push(childNode);

						// Create and append child nodes to this child node.
						createAndAppendChildNodes(childNode, items, options);
					}
				}
			};

			// Firstly, we need to find the root nodes.
			var rootNodes = [];
			for (var i = 0; i < dataItems.length; i++)
			{
				// Get the current item.
				var item = dataItems[i];

				// If this item has no parent then we treat it as a root node.
				if (!item[this._options.nodeParentField])
				{
					// Create the root node.
					var rootNode = new Node(item, this._options);

					// Create and append child nodes to this root node.
					createAndAppendChildNodes(rootNode, dataItems, this._options);

					// Add the root node.
					rootNodes.push(rootNode);
				}
			}

			// Set the root nodes.
			this._rootNodes = rootNodes;
		};

		this._createNodeContainers = function () 
		{
			var fill = function (children, childContainer) 
			{
				for (var i = 0; i < children.length; i++)
				{
					// Get the current child.
					var child = children[i];

					// Create a node container for this child.
					var container = new NodeContainer();

					// Create the parent node element and inject it into parent-container.
					child.appendNodeElementToParent(container.parentContainer);

					// Inject the node-container into the outer child container.
					childContainer.append(container.nodeContainer);

					// Repeat this process for ever child of the current child, if there are any.
					if (child.children.length > 0)
					{
						fill(child.children, container.childContainer);
					}
				}
			};

			// Populate the target container with the nested node containers.
			fill(this._rootNodes, this._target);
		};

		this._init();
	};

	/**
	 * Refresh the instance.
	 */
	Workflo.prototype.refresh = function ()
	{
	
	};

	/**
	 * Destroy this instance.
	 */
	Workflo.prototype.destroy = function ()
	{
		
	};

	// Export Workflo.
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') 
	{
		module.exports = Workflo;
	}
	else 
	{
		if (typeof define === 'function' && define.amd) 
		{
			define([], function() 
			{
				return Workflo;
			});
		}
		else 
		{
			window.Workflo = Workflo;
		}
	}
})();
