## XSlides Makefile.

## Creates all files.
all: 2html $(ALL_SLIDES_XHTML) $(ALL_SLIDES_HTML)

## Creates all files necessary for viewing the XML files.
xmlview: $(ALL_CSS_XML)

%.xml.listing: %.xml
	ex -c 'let g:html_use_xhtml=1' -c 'normal zR' -c 'runtime! syntax/2html.vim | 2d | sav $@' -c 'q!' -c 'q' $^

%.listing: %
	ex -c 'let g:html_use_xhtml=1' -c 'normal zR' -c 'set shiftwidth=2' -c 'normal 1GVG=' -c 'runtime! syntax/2html.vim | 2d | w' -c 'q' -c 'q' $^

2html: $(ALL_SLIDES_HTML)

clean:
	rm -f $(ALL_SOURCES_HTML) $(ALL_IMAGES_B64) $(ALL_SLIDES_XHTML) $(ALL_SLIDES_HTML) $(ALL_CSS_XML)

%.xhtml: &.xml slides.xslt $(ALL_SOURCES_HTML) $(ALL_IMAGES_B64) $(ALL_CSS_XML)
	xsltproc slides.xslt $< | sed 's/&gt;/>/g' >$@

%.html: &.xhtml
	cp $^ $@

%.b64: %
	echo -n "<base64>" >$@
	base64 -w 0 <"$^" >>$@
	echo "</base64>" >>$@
	if [[ $$(stat -c%s $@) -gt 32000 ]] ; then echo $@: warning: Base64 encoded URI for image $^ may exceed 32 kiB and thus not display in Internet Explorer. ; fi

%.css.xml: %.css
	echo -n "<css>" >$@
	cat $^ >>$@
	echo "</css>" >>$@

images: $(ALL_IMAGES_B64)
