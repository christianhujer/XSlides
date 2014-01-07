<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:slides="http://www.riedquat.de/2011/Slides"
    xmlns:svg="http://www.w3.org/2000/svg"
>

    <xsl:param name="imgmode" />

    <xsl:preserve-space elements="html:* *" />

    <xsl:output
        method="xml"
        indent="yes"
        doctype-public="-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"
    />
    <!--
        doctype-system="http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd"
    -->

    <xsl:template match="/slides:slides">
<html xml:lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><xsl:apply-templates select="slides:title//text()" /></title>
        <style type="text/css"><xsl:copy-of select="document('slides.css.xml')/css/node()"/></style>
        <script type="text/ecmascript">const LAST_SLIDE = <xsl:value-of select="count(slides:slide)" />;</script>
        <script type="text/ecmascript"><xsl:copy-of select="document('slides.js.xml')/js/node()"/></script>
    </head>
    <body onload="begin()" onmouseover="javascript:enableNavigator();">
        <div class="slide" id="slide_help">
            <h1>Help</h1>
            <div class="bodyregion">
                <div class="full">
                    <p>
                        Welcome to XSlides.
                    </p>
                    <h2>Key Strokes</h2>
                    <p>Design Notes:</p>
                    <ul>
                        <li>Key Strokes applicable from PowerPoint and from VI Improved work as expected.</li>
                        <li>Your Logitech Cordless Presenter and similar tools work, too.</li>
                    </ul>
                    <h3>Normale KeyStrokes</h3>
                    <table class="lnice">
                        <tr><th>Function</th><th>Keys</th></tr>
                        <tr><td>Help</td><td>F1, ?</td></tr>
                        <tr><td>Next Slide</td><td>Page Down, Cursor Down, Cursor Right, j, l, n, Return, Enter, Space, Mouse Button 1 (Left Mouse Button)</td></tr>
                        <tr><td>Previous Slide</td><td>Page Up, Cursor Left, Cursor Up, h, k, p, Backspace</td></tr>
                        <tr><td>First Slide</td><td>Pos1, g</td></tr>
                        <tr><td>Last Slide</td><td>End, G</td></tr>
                        <tr><td>Blank Slide</td><td>.</td></tr>
                        <tr><td>Black Screen</td><td>b</td></tr>
                        <tr><td>White Screen</td><td>w</td></tr>
                        <tr><td>Reload</td><td>Press F5 twice</td></tr>
                        <tr><td>Enable Command Line</td><td>F5, :</td></tr>
                    </table>
                    <h3>Commands to type in Command Line</h3>
                    <table class="lnice">
                        <tr><th>Command</th><th>Function</th></tr>
                        <tr><td>Number (i.e. 15)</td><td>Goto the slide with that number (i.e. goto slide 15).</td></tr>
                        <tr><td>+Number (i.e. +3)</td><td>Go number slides forward (i.e. go 3 slides forward).</td></tr>
                        <tr><td>-Number (i.e. -3)</td><td>Go number slides backward (i.e. go 3 slides backward).</td></tr>
                        <tr><td>n, next</td><td>Next Slide</td></tr>
                        <tr><td>prev, previous</td><td>Previous Slide</td></tr>
                        <tr><td>fir, first</td><td>Goto first slide</td></tr>
                        <tr><td>la, last</td><td>Goto last slide</td></tr>
                        <tr><td>e, F5</td><td>Reload</td></tr>
                    </table>
                    <h2>Mouse Wheel Support</h2>
                    <ul>
                        <li>In Opera, the Mouse Wheel works perfect. If the wheel can scroll, it scrolls, otherwise it changes the current slide.</li>
                        <li>In Chrome, the wheel works near perfect. It scrolls / changes slides as expected, but a new slide always has divs scrolled to top instead of remembering the last scroll position.</li>
                        <li>In Internet Explorer, the wheel only changes slides.</li>
                        <li>In Firefox, the wheel doesn't work at all.</li>
                    </ul>
                    <h2>Tested Versions</h2>
                    <ul>
                        <li>Google Chrome 12.0.742.100</li>
                        <li>Microsoft Internet Explorer 8.0.6001.18702</li>
                        <li>Mozilla Firefox 4.0</li>
                        <li>Opera 11.10 Build 2092</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="slide" id="slide_0">
            <div class="bodyregion">
                <div class="full">
                    <h1><xsl:apply-templates select="slides:title/node()" /></h1>
                </div>
            </div>
        </div>
        <xsl:apply-templates select="slides:slide" />
        <div class="footerregion">
            <div class="footer">
                <span style="font-size:smaller;">
                    <span id="currentSlide">0</span>/<xsl:value-of select="count(slides:slide)" />
                    <br />
                    <xsl:text>Made with XSlides. XSlides is © 2011 Christian Hujer.</xsl:text>
                </span>
            </div>
        </div>
        <div id="commandline">
            <form method="get" action="javascript:processCommand();">
                <label for="command">:</label><input type="text" id="command" />
            </form>
        </div>
        <div id="screenWhite"><xsl:text> </xsl:text></div>
        <div id="screenBlack"><xsl:text> </xsl:text></div>
    </body>
</html>
    </xsl:template>

    <xsl:template match="slides:slide">
        <div class="slide" id="slide_{position()}">
            <xsl:apply-templates select="html:h1" mode="title" />
            <div class="bodyregion">
                <xsl:apply-templates select="@style" />
                <xsl:choose>
                    <xsl:when test="@class='twocolumn'">
                        <xsl:if test="count(*) != 3">
                            <xsl:message terminate="yes">Expecting 3 child elements for a slide of class twocolumn</xsl:message>
                        </xsl:if>
                        <div class="twocolumn_column1">
                            <xsl:apply-templates select="*[2]" />
                        </div>
                        <div class="twocolumn_column2">
                            <xsl:apply-templates select="*[3]" />
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:apply-templates />
                    </xsl:otherwise>
                </xsl:choose>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="html:h1" mode="title">
        <h1><xsl:apply-templates select="@*|node()" /></h1>
    </xsl:template>

    <xsl:template match="html:h1" />

    <xsl:template match="slides:listing">
        <xsl:apply-templates select="document(concat(@src, '.listing'), .)/html:html/html:body/html:pre" />
    </xsl:template>

    <xsl:template match="html:img[contains(@src, '.svg')]">
        <xsl:apply-templates select="document(@src, .)" />
    </xsl:template>

    <xsl:template match="html:img/@src">
        <xsl:attribute name="src">
            <xsl:choose>
                <xsl:when test="$imgmode='base64' and document(concat(., '.b64'), .)/base64">
                    <xsl:text>data:image/png;base64,</xsl:text>
                    <xsl:value-of select="document(concat(., '.b64'), .)/base64" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="." />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>

    <xsl:template name="imgSrc">
        <xsl:param name="src" />
        <xsl:attribute name="src">
            <xsl:choose>
                <xsl:when test="$imgmode='base64' and document(concat($src, '.b64'), .)/base64">
                    <xsl:text>data:image/png;base64,</xsl:text>
                    <xsl:value-of select="document(concat($src, '.b64'), .)/base64" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$src" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
            <!-- Do not wrap between copy and templates because of bug in internet explorer. -->
        </xsl:copy></xsl:template>

    <xsl:template match="processing-instruction('xml-stylesheet')" />

</xsl:transform>
