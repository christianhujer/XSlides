<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
    version="1.0"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:slides="http://www.riedquat.de/2011/Slides"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xi="http://www.w3.org/2001/XInclude"
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
        <xi:include href="help.xhtml" />
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
                    <xsl:text>Made with XSlides. XSlides is © 2011 - 2014 Christian Hujer.</xsl:text>
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
        <xsl:message terminate="no">Use of deprecated <xsl:value-of select="name()" />&#xA;</xsl:message>
        <xsl:apply-templates select="document(concat(@src, '.listing'), .)/html:html/html:body/html:pre" />
    </xsl:template>

    <xsl:template match="html:a[@rel='Listing']">
        <xsl:apply-templates select="document(concat(@href, '.listing'), .)/html:html/html:body/html:pre" />
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

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
            <!-- Do not wrap between copy and templates because of bug in internet explorer. -->
        </xsl:copy></xsl:template>

    <xsl:template match="processing-instruction('xml-stylesheet')" />

</xsl:transform>
