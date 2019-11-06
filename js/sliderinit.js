

// initialize sliderAddNode
 var sliderAddNode = $('#sliderAddNode').slideReveal({
    trigger: $("#AddNodeButton"),
    position: "right",
    push: false,
    overlay: false,
    autoEscape: false,
  });

 //initialize sliderAddEdge
 var sliderAddEdge = $('#sliderAddEdge').slideReveal({
    trigger: $("#AddEdgeButton"),
    position: "right",
    push: false,
    overlay: false,
    autoEscape: false,
  });


 //close slider
$(".closeSlider").click(function(e) {
  slider.slideReveal("hide");
  sliderAddNode.slideReveal("hide");
  sliderAddEdge.slideReveal("hide");
});