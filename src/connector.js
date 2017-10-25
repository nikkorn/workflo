
/**
 * Populates the SVG with connectors.
 */
function populateConnectorSVG(svg, points, lineOptions)
{
    var defaults = {
        type: lineOptions.type || "angled",
        thickness: lineOptions.thickness || 2,
        colour: lineOptions.colour || "#4c4c4c",
    };

    // Function to create a SVG line which represents a connector.
    var drawLine = function (x1, y1, x2, y2) 
    {
        var connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        connector.setAttribute('x1', x1);
        connector.setAttribute('y1', y1);
        connector.setAttribute('x2', x2);
        connector.setAttribute('y2', y2);
        connector.setAttribute('stroke', defaults.colour);
        connector.setAttribute('stroke-width', defaults.thickness);
        connector.setAttribute('stroke-linecap', "square");
        svg.appendChild(connector);
    };

    // The strategies for drawing connector lines.
    var strategies = {
        straight : function () 
        {
            for (var i = 0; i < points.length; i++)
            {
                drawLine(0, "50%", "105%", points[i]);
            }
        },
        angled : function () 
        {
            drawLine(0, "50%", "50%", "50%");

            for (var i = 0; i < points.length; i++)
            {
                drawLine("50%", "50%", "50%", points[i]);
                drawLine("50%", points[i], "100%", points[i]);
            }
        }
    };

    // Use the desired strategy to draw the connectors.
    strategies[defaults.type]();
}