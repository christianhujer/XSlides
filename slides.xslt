<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:slides="http://www.riedquat.de/2011/Slides"
    xmlns:svg="http://www.w3.org/2000/svg"
>

    <xsl:preserve-space elements="html:* *" />

    <xsl:output
        method="xml"
        indent="yes"
        doctype-public="-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"
    />
    <!--
        doctype-system="http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd"
    -->

    <xsl:template match="slides:slides">
        <html xml:lang="en">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title><xsl:apply-templates select="slides:title//text()" /></title>
                <script type="text/ecmascript">LAST_SLIDE = <xsl:value-of select="count(slides:slide)" /></script>
                <script type="text/ecmascript" src="slides.js" />
            </head>
            <body>
            </body>
        </html>
    </xsl:template>

</xsl:transform>
