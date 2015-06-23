var PI = Math.PI;
function degreesToRadians(degrees) {
    return degrees * PI / 180;
}
function processPieslice(pieslice) {
    console.log("Processing pieslice: " + pieslice);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("style", pieslice.getAttribute("style")); /* TODO:2014-07-25:cher:3:All attributes should be copied, not just style. */
    var outset = Number(pieslice.getAttribute("outset")) || 0;
    /* TODO:2014-07-25:cher:3:The angles should be of type angle as described in http://www.w3.org/TR/SVG11/types.html#BasicDataTypes. */
    var startAngle = degreesToRadians(Number(pieslice.getAttribute("start"))) || 0;
    var rotationAngle = degreesToRadians(Number(pieslice.getAttribute("angle"))) || 2 * PI;
    var endAngle = startAngle + rotationAngle;
    var middleAngle = (startAngle + endAngle) / 2;
    var r = Number(pieslice.getAttribute("r")) || 1;
    var cx = (Number(pieslice.getAttribute("cx")) || 0) + outset * Math.sin(middleAngle);
    var cy = (Number(pieslice.getAttribute("cy")) || 0) - outset * Math.cos(middleAngle);
    var startX = cx + r * Math.sin(startAngle);
    var startY = cy - r * Math.cos(startAngle);
    var endX = cx + r * Math.sin(endAngle);
    var endY = cy - r * Math.cos(endAngle);
    var sweepFlags = rotationAngle > PI ? "1,1" : "0,1";
    path.setAttribute("d", "M" + cx + "," + cy + " L" + startX + "," + startY + " A" + r + "," + r + " 0 " + sweepFlags + " " + endX + "," + endY + " Z");
    pieslice.parentNode.replaceChild(path, pieslice);
}
function processPieslices() {
    console.log("Processing Pie Slices");
    while (document.getElementsByTagName("pieslice").length != 0)
        processPieslice(document.getElementsByTagName("pieslice")[0]);
}
window.addEventListener('load', processPieslices, false);
console.log("Loaded pie.js");
