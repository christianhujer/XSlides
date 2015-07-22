/** Hello program that seems to have formatting. **/
#include <stdio.h>
int main(void)
{
#ifdef __STDC_VERSION__
    printf("C version: %d\n", __STDC_VERSION__);
#else
    puts("__STDC_VERSION__ not available.\n");
#endif
    return 0;
}
