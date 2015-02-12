<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
>

    <xsl:template match="html:head">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
            <script type="text/javascript" src="XSlides.js" />
            <link rel="Stylesheet" type="text/css" href="XSlides.css" />
            <link rel="Stylesheet" type="text/css" href="debugLayout.css" />
        </xsl:copy>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:transform>
