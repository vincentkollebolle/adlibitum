//initialize sliderAdd
// var sliderAdd = $('#sliderAdd').slideReveal({
//   trigger: $(".triggerAdd"),
//   position: "right",
//   push: false,
//   overlay: false,
//   autoEscape: false,
// });

//initialize sliderContent
var sliderContent = $('#sliderContent').slideReveal({
  trigger: $(".triggerContent"),
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
