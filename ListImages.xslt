<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:html="http://www.w3.org/1999/xhtml"
    version="1.0"
>

    <xsl:output
        method="text"
    />

    <xsl:template match="html:img[not(contains(@src, ':'))]">
        <xsl:value-of select="@src" />
        <xsl:text>&#xA;</xsl:text>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()" />
    </xsl:template>

</xsl:transform>
