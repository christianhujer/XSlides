ALL_SLIDES_XHTML:=index.xhtml

.PHONY: all
all: scaleImages

include ../../Makefile

-include FlickrMakefile.mak

FlickrMakefile.mak:
	xsltproc FlickrMakefile.xslt FlickrImages.xml >$@
