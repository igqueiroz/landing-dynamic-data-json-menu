$(document).ready(function () {
	
	//montar a landing page para Classificados ou Lançamentos? Variável muda para puxar o valor de aluguel ou consultar imóvel
	tipo_landing = "l";		// c= Classificados; l= Lançamentos
	
	// Tipo de ordenação dos imóveis
	desconto = false;		// true = possui tag de desconto; false = não possui tag de desconto
	imoveis_aleatorios = false; // true = embaralha os imóveis toda vez que recarrega a landing
	
	utm_campanha = "imoveis_exclusivos" //UTM da campanha padrão web!
	
	//Formata os preços para o padrão R$
	Number.prototype.formatMoney = function (c, d, t) {
		var n = this,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "," : d,
			t = t == undefined ? "." : t,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};
	
	// variáveis para montagem do menu
	unicoUF = [];
	unicoCidade = [];
	boxAtual = [];
	boxCidade = [];
	
	//Captura o JSON gerado pela ferramenta
	$.getJSON(getHTMLJson, function (data) {

		// Identifica todos os fichas cadastradas
		qtd = Object.keys(data).length;
		
		// Seletor para número de ID = Object.keys(data)[0]
		// Seletor para atributos do objeto = data[ID].valor_venda;
		// Popula todas as <li>s
		for (i = 0; i < qtd; i++) {
			id_numero = Object.keys(data)[i];
			var numformat = parseFloat(data[id_numero].valor_venda).formatMoney(2, ',', '.');
			var numformat2 = parseFloat(data[id_numero].valor_aluguel).formatMoney(2, ',', '.');
			var nonformat = parseFloat(data[id_numero].valor_venda);
			
			//monta a UTM ejemplo = ?utm_source=site&utm_medium=banner&utm_term=landing_page&utm_content=setim&utm_campaign=feirao_caixa_cliente
			var anuncios = '<li class="box-anuncio"> <a href="' + data[id_numero].url_imovel;
			anuncios += '?utm_source=site&utm_medium=banner&utm_term=landing_page&';
			
			// Regex para lowerCase e substituir espaços para underline nome dos clientes
			var nomecliente = data[id_numero].nome_cliente;
			
			nomecliente = nomecliente.replace(/\s+/g, '_').toLowerCase();
			nomecliente = nomecliente.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
			nomecliente = nomecliente.replace(/[áãâà]/g,'a');
			nomecliente = nomecliente.replace(/[éêê]/g,'e');
			nomecliente = nomecliente.replace(/[í]/g,'i');
			nomecliente = nomecliente.replace(/[ôóõ]/g,'o');
			nomecliente = nomecliente.replace(/[ú]/g,'u');
			nomecliente = nomecliente.replace(/[ç]/g,'c');
			
			anuncios += 'utm_content=' + nomecliente + '&utm_campaign=' + utm_campanha + '_' + nomecliente + '" ';
			anuncios += ' target="_blank" class="play"></a>' 
				
			if (desconto == true) {
				anuncios += '<div class="flag-desconto">' + data[id_numero].desconto + '&#37; <span>OFF</span></div>';	
			}
			
			anuncios += '<h3><span class="cidade">' + data[id_numero].cidade + '</span> - <span class="uf">' + data[id_numero].uf + '</span><span class="id">' + id_numero + '</span></h3>';
			anuncios += '<img class="imagem-produto" src="' + data[id_numero].url_imagem + '" alt="' + data[id_numero].uf + ' - ' + data[id_numero].cidade + ' - ' + data[id_numero].bairro + ' -  '; 
			if (desconto == true) {
			anuncios += data[id_numero].desconto;
			}
			
			anuncios += '&#37;"><div class="info-rua">'

			if (data[id_numero].url_logo === "") {
				anuncios += '<div class="sem_logo">' + data[id_numero].nome_cliente + '</div>';

			} else {
				anuncios += '<img class="logo" src="' + data[id_numero].url_logo + '" alt="' + data[id_numero].nome_cliente + '">';

			}
			anuncios += '<div class="bairro">' + data[id_numero].bairro + '</div>';
			anuncios += '<div class="rua-completa">' + data[id_numero].rua + '</div>';
			anuncios += '<div class="rua">' + data[id_numero].rua + '</div></div><hr />';
			
			//verifica se puxa Aluguel ou Venda para Classificados
			if (tipo_landing == "c") {
				if (nonformat != 0) {
					anuncios += '<div class="preco"> R$ ' + numformat + '</div> <hr />';	
				}
				//puxa o preço do Aluguel de Classificados já formatado
				else { 
					anuncios += '<div class="preco aluguel"><span>Aluguel</span> R$ ' + numformat2 + '</div> <hr />';
				}
			}
			
			else {
				if (nonformat != 0) {
					anuncios += '<div class="preco"> R$ ' + numformat + '</div> <hr />';
				}
				
				else { 
					anuncios += '<div class="preco consultar"> CONSULTAR VALOR </div> <hr />';
				}
			}
			anuncios += '<ul class="info">';
			//Identifica se o anúncio tem todos os dados disponíveis
			if (data[id_numero].quartos !== "0") {anuncios += '<li class="quartos"><b>' + data[id_numero].quartos + '</b> quartos</li>'};
			
			if (data[id_numero].garagem !== "0") {anuncios += '<li class="garagem"><b>' + data[id_numero].garagem + '</b> vagas</li>'};
			if (data[id_numero].banheiros !== "0") {anuncios += '<li class="banheiros"><b>' + data[id_numero].banheiros + '</b> banheiros</li>'};
			if (data[id_numero].area !== "0") {anuncios += '<li class="area"><b>' + data[id_numero].area + 'm&sup2;</b> total</li>'};
			anuncios += '<a class="btn orange" href="' + data[id_numero].url_imovel + '" target="_blank" >Veja mais detalhes!</a></li></ul></li>';

			$('#boxes').append(anuncios);
			
			//monta a quantidade de UF em uma array
			boxAtual.push($("ul#boxes li.box-anuncio:eq(" + i + ") h3 span.uf").text());
			boxCidade.push([$("ul#boxes li.box-anuncio:eq(" + i + ") h3 span.cidade").text(),$("ul#boxes li.box-anuncio:eq(" + i + ") h3 span.uf").text()]);
			
		}
		
	
	}).done(function () {
		ordenarPrecos = [];
		function montaMenu() {
			// remove arrays duplicadas dentro de uma mesma Array
			$.each(boxAtual, function(i, el){
				if($.inArray(el, unicoUF) === -1) unicoUF.push(el);
			});
			
			//remove da array bidimensional elementos iguais para o mesmo estado x cidade
			function multiDimensionalUnique(arr) {
				var uniques = [];
				var itemsFound = {};
				for(var i = 0, l = arr.length; i < l; i++) {
					var stringified = JSON.stringify(arr[i]);
					if(itemsFound[stringified]) { continue; }
					uniques.push(arr[i]);
					itemsFound[stringified] = true;
				}
				return uniques;
			}
			
			// Aplica o filtro
			unicoCidade = multiDimensionalUnique(boxCidade);
			
			//Menu com erro (inserindo um espaço a mais) descomente esse código:
			//unicoUF.splice(-1,1)
			
			//popula com os estados e cidades automaticamente
			$('#empr-wrapper #empr-body .filtro ul#estados','#empr-wrapper #empr-body .filtro ul#cidades').empty();
			for (i = 0; i < unicoUF.length; i++) {
				$( '<li><a class="' + unicoUF[i].toLowerCase() + '" href="javascript:void(0)">' + unicoUF[i] + '</a></li>' ).appendTo( '#empr-wrapper #empr-body .filtro ul#estados' );
			}
			for (i = 0; i < unicoCidade.length; i++) {
				cleanningText = unicoCidade[i][0];
				cleanningText = cleanningText.replace(/\s+/g, '_').toLowerCase();
				cleanningText = cleanningText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
				cleanningText = cleanningText.replace(/[áãâà]/g,'a');
				cleanningText = cleanningText.replace(/[éêê]/g,'e');
				cleanningText = cleanningText.replace(/[í]/g,'i');
				cleanningText = cleanningText.replace(/[ôóõ]/g,'o');
				cleanningText = cleanningText.replace(/[ú]/g,'u');
				cleanningText = cleanningText.replace(/[ç]/g,'c');
				$( '<li><a class="' + cleanningText + ' ' + unicoCidade[i][1].toLowerCase() + '" href="javascript:void(0)">' + unicoCidade[i][0] + '</a></li>' ).appendTo( '#empr-wrapper #empr-body .filtro ul#cidades' );
			}
			
			// Adiciona os eventos ao clique do mouse no menu
			$( '<li><a class="todos" href="javascript:void(0)" class="selected">Todos os Estados</a></li>' ).prependTo( '#empr-wrapper #empr-body .filtro ul#estados' );
			$(".filtro ul#estados li a").click(function () {
				$('.filtro ul#estados li a').removeClass('selected');
				$(this).addClass('selected');
				$('.filtro ul#cidades li a').removeClass('selected');
				var estadoc = $(this).html();
				var estadocl = $(this).html().toLowerCase();
				$("#boxes li.box-anuncio").hide();
				$("#cidades li").hide();
				
				
				if ($(this).attr('class') === "todos selected") {
					$(this).addClass('selected');
					$("ul#boxes li.box-anuncio").fadeIn();
					$('#empr-wrapper #empr-body .filtro ul#cidades').hide();
				}
				else {
					for (i = 0; i < $("ul#boxes li.box-anuncio").length; i++) {
						var boxAtual = $("ul#boxes li.box-anuncio:eq(" + i + ") h3 span.uf").html();
						if (boxAtual === estadoc) {
							$("ul#boxes li.box-anuncio").eq(i).fadeIn();
						}
					}
					//monta o menu cidades de acordo com o estado selecionado
					for (i = 0; i < unicoCidade.length; i++) {
						//ECMAScript 6
						var boxAtual = document.querySelectorAll('.filtro ul#cidades li')[i].querySelector('a').classList[1];
						if (boxAtual === estadocl) {
							$("#cidades li").eq(i).fadeIn();
						}
					}
					if($('#empr-wrapper #empr-body .filtro ul#cidades').is(":visible")) {
						$('#empr-wrapper #empr-body .filtro ul#cidades').hide();
					}
					$('#empr-wrapper #empr-body .filtro ul#cidades').slideToggle(500);
					$('.ordemprecos').removeClass('selected');
				}
			});
			//monta o filtro de cidades
			$(".filtro ul#cidades li a").click(function () {
				$(".filtro ul#cidades li a").removeClass('selected');
				$(this).addClass('selected');
				var boxAtual = $(this).html();
				$("ul#boxes li.box-anuncio").fadeOut();
				for (i = 0; i < $("ul#boxes li.box-anuncio").length; i++) {
					//ECMAScript 6
					var estadoc = document.querySelectorAll('#boxes li.box-anuncio')[i].querySelector('h3 span.cidade').innerHTML;
					if (boxAtual === estadoc) {
						$("ul#boxes li.box-anuncio").eq(i).fadeIn();
					}
				}
				$('.ordemprecos').removeClass('selected');
			});
			//monta o estado inicial para todos os Estados
			$('#empr-wrapper div#empr-body .filtro ul#estados li a.todos').addClass('selected');
			$('#empr-wrapper #empr-body .filtro ul#cidades').hide();
		
		}
		function montaFiltros() {
			//$( '#empr-wrapper #empr-body .estados' ).after( $( '<ul id="preco"><li><a class="menorPreco ordemprecos" href="javascript:void(0)"> Menor Preço </a></li><li><a class="maiorPreco ordemprecos" href="javascript:void(0)"> Maior Preço </a></li></ul>' ) );
		
			$( '<ul id="preco"><li><a class="menorPreco ordemprecos" href="javascript:void(0)"> Menor Preço </a></li><li><a class="maiorPreco ordemprecos" href="javascript:void(0)"> Maior Preço </a></li></ul>' ).appendTo( '#empr-wrapper #empr-body .filtro' );
			$(".filtro ul#preco li a.menorPreco").click(function(e) {
				ordernarMenorPreco(e);
			});
														
			$(".filtro ul#preco li a.maiorPreco").click(function(e) {
				ordernarMaiorPreco(e);
			});
		}
		posicao = [];
		quantidadeBoxes = $('.flag-desconto').length;

		for (i = 0; i < quantidadeBoxes; i++ ) {
				posicao.push([parseInt($('.flag-desconto').eq(i).html()),$('ul#boxes li.box-anuncio').eq(i)]);
			}
		//maior desconto primeiro
		function compareDesconto(a, b) {
		  if (a[0] > b[0]) return -1;
		  if (a[0] < b[0]) return 1;
		  return 0;
		}
		function compareDescontoMenor(a, b) {
		  if (b[0] > a[0]) return -1;
		  if (b[0] < a[0]) return 1;
		  return 0;
		}
		
		posicao.sort(compareDesconto);

		function ordenarDesconto() {
			for (i = 0; i < quantidadeBoxes; i++ ) {
				$('#boxes').append(posicao[i][1]);
			}
			
			$('.box-anuncio').fadeIn();
		}

		// função para embaralhar os anúncios da landing a cada refresh --> COM ERRO!
		function randomDivs() {
			for(i=0; i<quantidadeBoxes; i++){

				randomDiv = Math.floor(Math.random()*len);
				divs.eq(randomDiv).show()
			};
		}

		function ordernarMaiorPreco(e) {
			var cleanPrecos1 = "";
			var countBoxes = $('#boxes li.box-anuncio:visible').length;
			ordenarPrecos = [];
			if(e.target.className === "maiorPreco ordemprecos selected") {return false;}
			else {
					
					for (i = 0; i < countBoxes; i++ ) {
						cleanPrecos1 = $('#boxes li.box-anuncio:visible:eq(' + i + ') .preco').html();
						if (cleanPrecos1 == " CONSULTAR VALOR " ) {
							cleanPrecos1 = "0";
						}
						cleanPrecos1 = parseInt(cleanPrecos1.replace(/\.|\,|^\D+/g,''));
						//monta os preços em um array
						console.log(cleanPrecos1);
						ordenarPrecos.push([(cleanPrecos1),$('ul#boxes li.box-anuncio:visible').eq(i)]);
					}
					//console.log(ordenarPrecos.length);
					ordenarPrecos.sort(compareDesconto);
					$('#boxes li.box-anuncio').hide();
					for (i = 0; i < countBoxes; i++ ) {
						$('#boxes').append(ordenarPrecos[i][1]);
						ordenarPrecos[i][1].fadeIn();
					}
					//console.log(ordenarPrecos);
					$('.ordemprecos').removeClass('selected');
					$('.maiorPreco').addClass('selected');
			}

		}

		function ordernarMenorPreco(e) {
			var cleanPrecos2 = "";
			var countBoxes = $('#boxes li.box-anuncio:visible').length;
			ordenarPrecos = [];
			if(e.target.className === "menorPreco ordemprecos selected") {return false;}
			else {
					
					for (i = 0; i < countBoxes; i++ ) {
						cleanPrecos2 = $('#boxes li.box-anuncio:visible:eq(' + i + ') .preco').html();
						if (cleanPrecos2 == " CONSULTAR VALOR " ) {
							cleanPrecos2 = "R$ 999999999999,00";
						}
						//console.log(cleanPrecos2);
						cleanPrecos2 = parseInt(cleanPrecos2.replace(/\.|\,|^\D+/g,''));
						//monta os preços em um array
						ordenarPrecos.push([(cleanPrecos2),$('ul#boxes li.box-anuncio:visible').eq(i)]);
					}
					//console.log(ordenarPrecos.length);
					ordenarPrecos.sort(compareDescontoMenor);
					//console.log(ordenarPrecos);
					$('#boxes li.box-anuncio').hide();		
					for (i = 0; i < countBoxes; i++ ) {
						$('#boxes').append(ordenarPrecos[i][1]);
						ordenarPrecos[i][1].fadeIn();
					}
					
					$('.ordemprecos').removeClass('selected');
					$('.menorPreco').addClass('selected');
			}
		}	
		//Ordena a landing como imóveis aleatórios ou descontos!
		if (imoveis_aleatorios) {
			randomDivs();
		}
		else {
			ordenarDesconto();
		}

		montaMenu();
		montaFiltros();

			});
	
	
		
});
