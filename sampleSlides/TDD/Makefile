ALL_SLIDES_XHTML:=index.xhtml

FLICKR_IMAGE_NAMES:=\
    BarbaraLiskov.jpg \
    BertrandMeyer.jpg \
    EdsgerDijkstra.jpg \
    ErichGamma.jpg \
    GradyBooch.jpg \
    JeannetteWing.jpg \
    JohnMcCarthy.jpg \
    KentBeck.jpg \
    MartinFowler.jpg \
    MichaelFeathers.jpg \
    UncleBob.jpg \
    WardCunningham.jpg \

SCALED_IMAGES:=$(addprefix gfx/flickr/,$(FLICKR_IMAGE_NAMES))

.PHONY: all
all: scaleImages

include ../../Makefile

.PHONY: scaleImages
scaleImages: $(SCALED_IMAGES)

.PHONY: deleteScaledImages
clean: deleteScaledImages
deleteScaledImages:
	rm -f $(SCALED_IMAGES)

gfx/flickr/%.jpg: gfx/flickr/%_o.jpg
	<$^ anytopnm | pnmscale -xysize 400 300 | pnmtojpeg >$@

gfx/flickr/BarbaraLiskov_o.jpg:
	wget -O $@ http://farm5.staticflickr.com/4131/5041351059_15ae7603a7_o.jpg

gfx/flickr/BertrandMeyer_o.jpg:
	wget -O $@ http://farm5.staticflickr.com/4132/5160656353_bdb85c5f49_o.jpg

gfx/flickr/EdsgerDijkstra_o.jpg:
	wget -O $@ http://farm1.staticflickr.com/40/76644728_ba42b9b20f_o.jpg

gfx/flickr/ErichGamma_o.jpg:
	wget -O $@ http://farm3.staticflickr.com/2198/1761121773_502f5fb47e_o.jpg

gfx/flickr/GradyBooch_o.jpg:
	wget -O $@ http://farm5.staticflickr.com/4065/4531235260_c72cc6777e_o.jpg

gfx/flickr/JeannetteWing_o.jpg:
	wget -O $@ http://farm3.staticflickr.com/2729/4052660923_76f5093c44_o.jpg

gfx/flickr/JohnMcCarthy_o.jpg:
	wget -O $@ http://farm2.staticflickr.com/1300/1338577487_13cd82c180_o.jpg

gfx/flickr/KentBeck_o.jpg:
	wget -O $@ http://farm4.staticflickr.com/3292/3062930943_bc9b505385_o.jpg

gfx/flickr/MartinFowler_o.jpg:
	wget -O $@ http://farm7.staticflickr.com/6038/6346491765_68a8ebc5e2_o.jpg

gfx/flickr/MichaelFeathers_o.jpg:
	wget -O $@ http://farm4.staticflickr.com/3464/3394786679_a36b0079c8_o.jpg

gfx/flickr/UncleBob_o.jpg:
	wget -O $@ http://farm8.staticflickr.com/7346/9244541389_8827c0891b_o.jpg

gfx/flickr/WardCunningham_o.jpg:
	wget -O $@ http://farm7.staticflickr.com/6046/6281749146_8bf8b84679_o.jpg
