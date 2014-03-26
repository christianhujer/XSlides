<?xml version="1.0" encoding="UTF-8"?>
<!-- Upgrades older versions of XSlides to the latest version. -->
<xsl:transform
    version="1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:slides="http://www.riedquat.de/2011/Slides"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>

    <xsl:template match="slides:listing">
        <a href="{@src}" rel="Listing" />
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
        </xsl:copy>
    </xsl:template>

</xsl:transform>
