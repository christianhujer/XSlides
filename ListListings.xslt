<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:slides="http://www.riedquat.de/2011/Slides"
    xmlns:html="http://www.w3.org/1999/xhtml"
    version="1.0"
>

    <xsl:output
        method="text"
    />

    <xsl:template match="slides:listing|html:a[@rel='Listing']">
        <xsl:value-of select="@src|@href" />
        <xsl:text>&#xA;</xsl:text>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()" />
    </xsl:template>

</xsl:transform>
