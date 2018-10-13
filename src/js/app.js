const animationContainer = document.getElementById('animationContainer');
const musicalContainer = document.getElementById('musicalContainer');
const videoInfContainer = document.getElementById('videoInfo');
const topInfContainer = document.getElementById('topContainer');
const sugestionContainer = document.getElementById('moviesSugestions');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const form = document.getElementById('formSearch');
const Url = 'https://yts.am/api/v2/list_movies.json';
const UrlSugestion = 'https://yts.am/api/v2/movie_suggestions.json?';

async function load()
{


	async function requestUrl(url)
	{
		const responseRequest = await fetch(url);
		const responseJson = await responseRequest.json();
		return responseJson;
	}

	function templateMovieCategory(obj)
	{
		return (
			`
				<article class="itemMovie" data-id="${obj.id}">
			 	<picture class="movie-cover"><img src="${obj.medium_cover_image}" alt="${obj.medium_cover_image}"></picture>
				<h4 class="title-movie">${obj.title}</h4>
			  </article> 
			`
			)
	}

	function templateMovieInf(data)
	{
		return (
				`
				 <picture><img width="60" src="${data.medium_cover_image}" alt="${data.medium_cover_image}"></picture>
			<h3 class="title-info"><span>Pelicula encontrada:</span><br>${data.title}</h3>
				`
			)
	}

	function templateTopMovies(obj)
	{
		return (
				`
				<a href="">${obj.title}</a>
				`
			)
	}

	function createTemplateCategory(itemObj)
	{
		const strTemplate = templateMovieCategory(itemObj);
		const dom = document.implementation.createHTMLDocument();
		dom.body.innerHTML = strTemplate;
		const tagHtml = dom.body.children[0];
		return tagHtml;
	}

	function createTemplateTop(itemObj)
	{
		const srtTemplate = templateTopMovies(itemObj);
		const dom = document.implementation.createHTMLDocument();
		dom.body.innerHTML = srtTemplate;
		const tagHtml = dom.body.children[0];
		return tagHtml;
	}

	function renderTemplateCategory(arrayColection,container)
	{
		container.children[0].remove();
		arrayColection.forEach((itemColection) => {
		const tagTemplate = createTemplateCategory(itemColection);
		container.append(tagTemplate);
		container.classList.add('fadeIn');
		addEventsTagCategory(tagTemplate,arrayColection);
		})
	}

	function renderTopMovies(arrayColection,container)
	{
		container.children[0].remove();
		arrayColection.forEach((itemColection) =>{
			const tagHtml = createTemplateTop(itemColection);
			container.append(tagHtml);
		})
	}

	function searchId(id,obj)
	{
		const movieFound = obj.find((item)=> item.id == id)
		return movieFound;
	}

	( function eventSubmit()
	{
			form.addEventListener('submit',async (event)=>{
				event.preventDefault();
				const getValue = new FormData(form);
				try
				{
					const {data:{movies:data}} = await requestUrl(`${Url}?limit=1&query_term=${getValue.get('busca')}`)
					const template = templateMovieInf(data[0]);
					videoInfContainer.innerHTML = template;
					videoInfContainer.classList.add('showVideoInfo');
				}
				catch(error)
				{
					alert('no esta disponible esta pelicula')
				}
			})
	})()

		function addEventsTagCategory(tag,obj)
	{
			tag.addEventListener('click',() => {
			overlay.classList.add('showOverlay');
			modal.classList.add('modalIn');
			const id = parseInt(tag.dataset.id);
			const movieFind = searchId(id,obj);
			modal.querySelector('h3').textContent = movieFind.title;
			modal.querySelector('img').src = movieFind.medium_cover_image;
			modal.querySelector('p').textContent = movieFind.synopsis;
		})

		modal.querySelector('button').addEventListener('click',()=> {
			modal.classList.add('modalOut');
			overlay.classList.remove('showOverlay');
		});

		modal.addEventListener('animationend',(event)=>{
			if(event.animationName === 'modalIn') modal.classList.remove('modalIn');
			if(event.animationName === 'modalOut') modal.classList.remove('modalOut'); 
		})
	}

	async function sendData(url)
	{
		const { data:{ movies:data } } = await requestUrl(url)
		return data;
	}

	async function cacheExist(category,parametro)
	{
		const listCache = window.localStorage.getItem(category);//obtener local storage

		if(listCache) return JSON.parse(listCache); //si hay cache devuelvela

		const data = await sendData(`${Url}?${parametro}`); //si no hay cache hacemos la consulta al servidor
		window.localStorage.setItem(category,JSON.stringify(data));
	  return data;
	}

	const topData = await cacheExist('topMovies','minimum_rating=9'); 
	renderTopMovies(topData,topContainer);

	const MoviesSugestions = await sendData('https://yts.am/api/v2/movie_suggestions.json?movie_id=10');
	renderTopMovies(MoviesSugestions,sugestionContainer)

	const animationData = await cacheExist('animation','genre=animation');
	renderTemplateCategory(animationData,animationContainer);

	const musicalData = await cacheExist('musical','genre=musical');
	renderTemplateCategory(musicalData,musicalContainer);

}

load();