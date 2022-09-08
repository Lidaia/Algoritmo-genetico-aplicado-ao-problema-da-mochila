#include <stdio.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

int status;

char linha[100];

char *comando[5];

int main()
{
	int i,j,k;

	for(;;)
	{
		for(i=0;i<100;i++) {
			linha[i]='\0';
		}

		for(i=0;i<5;i++) {
			comando[i]='\0';
		}

		printf("MS>");

		comando[0] = linha;

		for(i=0; (linha[i]=getchar())!=('\n');i++) {
		}

		linha[i]='\0';

		printf("%s\n",linha);
		
		k = 1;

		for(j=0;j<i+1;j++) {
			if(linha[j]==' ') {
				linha[j]='\0';
				comando[k]=&linha[j+1];
				k = k+1;
			}
		}

                if(fork()==0)
		{
			execvp(comando[0],comando);
			printf("sinto muito .. nao pude executar o comando\n");
		}
	
		wait(&status);
	}
}