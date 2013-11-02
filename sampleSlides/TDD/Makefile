ALL_SLIDES_XHTML:=index.xhtml

.PHONY: all
all: scaleImages

include ../../Makefile

.PHONY: scaleImages
scaleImages: gfx/KentBeck.jpg gfx/UncleBob.jpg gfx/MichaelFeathers.jpg gfx/MartinFowler.jpg gfx/WardCunningham.jpg

gfx/%.jpg: gfx/%_o.jpg
	<$^ anytopnm | pnmscale -width 400 | pnmtojpeg >$@

gfx/KentBeck_o.jpg:
	wget -O $@ http://farm4.staticflickr.com/3292/3062930943_bc9b505385_o.jpg

gfx/MichaelFeathers_o.jpg:
	wget -O $@ http://farm4.staticflickr.com/3464/3394786679_a36b0079c8_o.jpg

gfx/UncleBob_o.jpg:
	wget -O $@ http://farm8.staticflickr.com/7346/9244541389_8827c0891b_o.jpg

gfx/MartinFowler_o.jpg:
	wget -O $@ http://farm7.staticflickr.com/6038/6346491765_68a8ebc5e2_o.jpg

gfx/WardCunningham_o.jpg:
	wget -O $@ http://farm7.staticflickr.com/6046/6281749146_8bf8b84679_o.jpg
