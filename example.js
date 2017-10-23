 function apply ()
  {
    var target = document.getElementById("target");

    var data = [
        {
            species: "fish",
            type: "root"
        },
        {
            species: "seahorse",
            type: "vegetarian",
            group: "fish"
        },
        {
            species: "shark",
            type: "carnivore",
            group: "fish"
        },
        {
            species: "hammerhead",
            type: "carnivore",
            group: "shark"
        },
        {
            species: "great white",
            type: "carnivore",
            group: "shark"
        },
        {
            species: "evil hammerhead",
            type: "carnivore",
            group: "hammerhead"
        },
        {
            species: "sneaky hammerhead",
            type: "carnivore",
            group: "hammerhead"
        },
        {
            species: "yellow hammerhead",
            type: "carnivore",
            group: "hammerhead"
        },
        {
            species: "racist hammerhead",
            type: "carnivore",
            group: "hammerhead"
        }
    ];

    var defaultDefinition = {                                         	
        tooltip: function (node) { return node.name() },                                   
        template: function (node) { 
            return "<div class='animal-box'>" +
            `<p><b>${node.item.species}</b></p>` +
            `<hr style='color:#FFFFFF;'>` +
            `<p>${node.item.group}</p>` +
            "</div>";
        }         
    };

    var options = {
      data,
      nodeIdField: "species",
	  nodeNameField: "species",
	  nodeTypeField: "type",
	  nodeParentField: "group",
      definition: {
          default: defaultDefinition,
          additional: []
      }
    };

    workflo = new Workflo(target, options);
  }