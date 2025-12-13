// Уақытша мок мәліметтер (базасыз жұмыс істеу үшін)
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import type { MediaItem } from "./types"

const MEDIA_FILE = join(process.cwd(), ".mock-media.json")

// Материалдарды файлдан оқу
function loadMediaFromFile(): { movies: MediaItem[]; books: MediaItem[]; games: MediaItem[] } | null {
  try {
    if (existsSync(MEDIA_FILE)) {
      const data = readFileSync(MEDIA_FILE, "utf-8")
      
      // Бос немесе толық емес JSON файлын тексеру
      if (!data || data.trim().length === 0) {
        console.warn("Материалдар файлы бос")
        return null
      }
      
      const parsed = JSON.parse(data)
      return {
        movies: Array.isArray(parsed.movies) ? parsed.movies : [],
        books: Array.isArray(parsed.books) ? parsed.books : [],
        games: Array.isArray(parsed.games) ? parsed.games : [],
      }
    }
  } catch (error) {
    console.error("Материалдарды жүктеу қатесі:", error)
    // Файл бұзылған болса, оны жою және қалпына келтіру
    try {
      if (existsSync(MEDIA_FILE)) {
        const fs = require("fs")
        fs.unlinkSync(MEDIA_FILE)
        console.log("Бұзылған материалдар файлы жойылды")
      }
    } catch (unlinkError) {
      console.error("Файлды жою қатесі:", unlinkError)
    }
  }
  return null
}

// Жадтағы материалдарды файлдан жаңарту
function refreshMediaFromFile() {
  const saved = loadMediaFromFile()
  if (saved) {
    // Тип бойынша қосымша фильтрлеу - материалдар дұрыс массивтерге бөлінуі керек
    const filteredMovies = saved.movies ? saved.movies.filter((item: MediaItem) => item.type === "movie") : []
    const filteredBooks = saved.books ? saved.books.filter((item: MediaItem) => item.type === "book") : []
    const filteredGames = saved.games ? saved.games.filter((item: MediaItem) => item.type === "game") : []
    
    // Файлдан жүктелген материалдарды жадтағы массивтерге салу
    movies = filteredMovies
    books = filteredBooks
    games = filteredGames
    if (filteredMovies.length > 0 || filteredBooks.length > 0 || filteredGames.length > 0) {
      movies = filteredMovies
      books = filteredBooks
      games = filteredGames
    }
    // Егер файл бос болса, еш нәрсені өзгертпеу (бастапқы мәліметтер сақталады)
  }
  // Егер файл жоқ болса, еш нәрсені өзгертпеу (бастапқы мәліметтер сақталады)
}

// Материалдарды файлға сақтау
function saveMediaToFile(movies: MediaItem[], books: MediaItem[], games: MediaItem[]) {
  try {
    // Тип бойынша қосымша фильтрлеу - материалдар дұрыс массивтерге бөлінуі керек
    const filteredMovies = movies.filter((item) => item.type === "movie")
    const filteredBooks = books.filter((item) => item.type === "book")
    const filteredGames = games.filter((item) => item.type === "game")
    
    writeFileSync(
      MEDIA_FILE,
      JSON.stringify(
        {
          movies: filteredMovies,
          books: filteredBooks,
          games: filteredGames,
        },
        null,
        2
      ),
      "utf-8"
    )
  } catch (error) {
    console.error("Материалдарды сақтау қатесі:", error)
  }
}

export const mockMovies: MediaItem[] = [
  {
    id: "1",
    title: "Inception",
    description: "Арман әлемі арқылы құпия ақпарат ұрлайтын ұры туралы ғылыми-фантастикалық триллер. Дом Кобб - бұл арман әлемінде құпияларды ұрлау саласындағы ең үздік маман. Оған кері тапсырма беріледі - идеяны емес, ұрлау керек, ал салу керек. Бұл оның өміріндегі ең қиын миссия болады.",
    coverImage: "/inception-movie-poster.png",
    type: "movie",
    rating: 8.8,
    year: 2010,
    genre: ["Ғылыми фантастика", "Триллер"],
    popularity: 95,
    watchUrl: "https://vkvideo.ru/video-220018529_456240825?ref_domain=yastatic.net",
  },
  {
    id: "4",
    title: "Breaking Bad",
    description: "Химия мұғалімі Уолтер Уайттың метамфетамин өндірушіге айналуын баяндайтын драмалық сериал. Оның өмірі өзгеріп, ол қылмыс әлеміне тереңірек батып кетеді. Бұл сериал моральдық шекаралар мен отбасылық құндылықтар туралы.",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie",
    rating: 9.5,
    year: 2008,
    genre: ["Драма", "Қылмыс"],
    popularity: 99,
  },
  {
    id: "6",
    title: "Oppenheimer",
    description: "Американдық ғалым Дж. Роберт Оппенгеймердің атом бомбасын жасаудағы рөлі туралы биографиялық драма. Фильм Манхэттен жобасының тарихын, ғылыми зерттеулерді және моральдық дилеммаларды көрсетеді.",
    coverImage: "/images/posters/oppenheimer-poster.png",
    type: "movie",
    rating: 8.9,
    year: 2023,
    genre: ["Биография", "Драма"],
    popularity: 94,
  },
  {
    id: "movie-7",
    title: "The Dark Knight",
    description: "Бэтменнің Готэм қаласында Джокермен кездесуі және моральдық шекараларды сынауы туралы суперқаһарман фильмі. Хит Леджердің Джокер рөлі кинематография тарихындағы ең үздік рөлдердің бірі болып саналады.",
    coverImage: "/dark-knight-inspired-poster.png",
    type: "movie",
    rating: 9.0,
    year: 2008,
    genre: ["Экшен", "Драма", "Қылмыс"],
    popularity: 97,
    watchUrl: "https://vkvideo.ru/video-143260624_456239857",
  },
  {
    id: "movie-8",
    title: "Interstellar",
    description: "Адамзаттың тіршілігін сақтау үшін ғарышқа саяхат жасайтын зерттеушілер тобы туралы ғылыми-фантастикалық фильм. Кристофер Ноланның бұл жұмысы уақыт, кеңістік және махаббат туралы терең ойлар туғызады.",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "movie",
    rating: 8.7,
    year: 2014,
    genre: ["Ғылыми фантастика", "Драма"],
    popularity: 94,
    watchUrl: "https://vkvideo.ru/video-231084166_456244705?ref_domain=yastatic.net",
  },
  {
    id: "movie-9",
    title: "The Matrix",
    description: "Компьютер симуляциясында тұрған адамзатты азат ету туралы ғылыми-фантастикалық экшен фильмі. Нео адамзаттың шынайы табиғатын біліп, Матрицадан шығу жолын табады. Бұл фильм философия мен технологияны біріктіретін классикалық шығарма.",
    coverImage: "/the-matrix.png",
    type: "movie",
    rating: 8.7,
    year: 1999,
    genre: ["Ғылыми фантастика", "Экшен"],
    popularity: 96,
  },
  {
    id: "movie-10",
    title: "The Last of Us",
    description: "Постапокалиптикалық әлемде өмір сүру туралы драмалық сериал. Джоэл мен Эллидің оқиғасы - бұл отбасылық байланыс, қауіп пен үміт туралы терең ойлар туғызатын сериал. Керемет актерлік ойын және эмоционалды оқиға.",
    coverImage: "/last-of-us-series-poster.jpg",
    type: "movie",
    rating: 9.2,
    year: 2023,
    genre: ["Драма", "Шытырман"],
    popularity: 96,
  },
  {
    id: "movie-11",
    title: "Pulp Fiction",
    description: "Квентин Тарантиноның қылмыстық драмасы. Бірнеше оқиға бір-бірімен байланысып, Лос-Анджелестегі қылмыстық әлемді көрсетеді. Керемет диалогтар, бейтарап юмор және бірегей режиссерлік стиль.",
    coverImage: "/pulp-fiction.png",
    type: "movie",
    rating: 8.9,
    year: 1994,
    genre: ["Қылмыс", "Драма"],
    popularity: 95,
    watchUrl: "https://vkvideo.ru/video-34229261_456248235?ref_domain=yastatic.net",
  },
  {
    id: "movie-12",
    title: "The Shawshank Redemption",
    description: "Түрмеде өткен достық пен үміт туралы драма. Энди Дюфрейннің оқиғасы - бұл адамзат рухының күші мен достықтың маңызы туралы классикалық фильм. Керемет актерлік ойын және терең эмоционалды оқиға.",
    coverImage: "/the-shawshank-redemption.png",
    type: "movie",
    rating: 9.3,
    year: 1994,
    genre: ["Драма"],
    popularity: 98,
    watchUrl: "https://rutube.ru/video/1a13ed24b9f105b43c8b9d19f1b6846a/",
  },
  {
    id: "movie-13",
    title: "Fight Club",
    description: "Заманауи қоғамның сыны мен адамзат табиғаты туралы психологиялық драма. Анонимдік басты кейіпкердің өмірі өзгеріп, ол қоғамдық нормаларға қарсы күреседі. Философиялық тереңдік пен күшті оқиға.",
    coverImage: "/inception-movie-poster.png",
    type: "movie",
    rating: 8.8,
    year: 1999,
    genre: ["Драма", "Триллер"],
    popularity: 93,
  },
  {
    id: "movie-14",
    title: "Forrest Gump",
    description: "Америка тарихы арқылы өтетін Форрест Гамптің өмір оқиғасы. Ол әлеуметтік оқиғаларға қатысып, махаббат пен достықты табады. Керемет актерлік ойын, эмоционалды оқиға және тарихи контекст.",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "movie",
    rating: 8.8,
    year: 1994,
    genre: ["Драма", "Романтика"],
    popularity: 94,
  },
  {
    id: "movie-15",
    title: "The Godfather",
    description: "Сицилия мафиясының отбасылық оқиғасы. Корлеоне отбасының тарихы - бұл билік, отбасылық құндылықтар және қылмыс әлемі туралы эпикалық драма. Кинематография тарихындағы ең үздік фильмдердің бірі.",
    coverImage: "/the-godfather.png",
    type: "movie",
    rating: 9.2,
    year: 1972,
    genre: ["Қылмыс", "Драма"],
    popularity: 97,
    watchUrl: "https://kz1.kinogo-films.lat/2341-krestnyj-otec-1972.html",
  },
  {
    id: "movie-16",
    title: "Goodfellas",
    description: "Нью-Йорк мафиясында өткен Генри Хиллдің оқиғасы. Ол қылмыстық әлемге батып кетіп, өмірінің барлық кезеңдерін басынан өткізеді. Керемет режиссерлік жұмыс және нақты оқиғаларға негізделген.",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie",
    rating: 8.7,
    year: 1990,
    genre: ["Қылмыс", "Драма"],
    popularity: 92,
  },
  {
    id: "movie-17",
    title: "Schindler's List",
    description: "Екінші дүниежүзілік соғыс кезіндегі Оскар Шиндлердің оқиғасы. Ол еврейлерді құтқару үшін өз бизнесін пайдаланады. Бұл адамгершілік, құтқару және тарих туралы терең драма.",
    coverImage: "/schindler`s-list.png",
    type: "movie",
    rating: 8.9,
    year: 1993,
    genre: ["Драма", "Тарих"],
    popularity: 95,
    watchUrl: "https://vkvideo.ru/video-220018529_456243376?ref_domain=yastatic.net",
  },
  {
    id: "movie-18",
    title: "The Lord of the Rings: The Return of the King",
    description: "Толкиннің фэнтези әлеміндегі соңғы бөлім. Фродо мен оның достары Сақинаны жою үшін соңғы саяхатқа шығады. Эпикалық соғыстар, қаһармандық және достық туралы керемет фильм.",
    coverImage: "/the-lord-of-the-rings.png",
    type: "movie",
    rating: 9.0,
    year: 2003,
    genre: ["Фэнтези", "Шытырман"],
    popularity: 98,
    watchUrl: "https://hd.vlastelinkolec-lordfilm.ru/dve-kreposti/",
  },
  {
    id: "movie-19",
    title: "Parasite",
    description: "Кореялық отбасылардың әлеуметтік теңсіздік туралы сатиралық триллер. Ким отбасысы бай Пак отбасына қызметкер ретінде кіреді. Бұл фильм әлеуметтік теңсіздік пен сыныптық қатынастар туралы терең ойлар туғызады.",
    coverImage: "/inception-movie-poster.png",
    type: "movie",
    rating: 8.5,
    year: 2019,
    genre: ["Триллер", "Драма"],
    popularity: 91,
  },
  {
    id: "movie-20",
    title: "Spirited Away",
    description: "Миядзаки Хаяоның аниме шедевры. Чихиро сиқырлы әлемге түсіп, өз ата-анасын құтқару үшін күреседі. Керемет анимация, терең ойлар және балалар мен ересектерге арналған керемет оқиға.",
    coverImage: "/generic-fantasy-game-cover.png",
    type: "movie",
    rating: 8.6,
    year: 2001,
    genre: ["Анимация", "Фэнтези"],
    popularity: 93,
    watchUrl: "https://youtu.be/HHaRYQsNma0",
  },
]

export const mockBooks: MediaItem[] = [
  {
    id: "3",
    title: "Dune",
    description: "Саясат, дін және экология тоғысқан Arrakis туралы классикалық ғылыми-фантастика. Фрэнк Герберттің бұл романы ғаламдық империя, шөл планетасы және бағалысы спайс дегені туралы. Пол Атрейдестің оқиғасы - бұл күш пен билік туралы эпикалық оқиға.",
    coverImage: "/dune-book-cover.png",
    type: "book",
    rating: 8.5,
    year: 1965,
    genre: ["Ғылыми фантастика", "Фэнтези"],
    popularity: 92,
    watchUrl: "https://1.librebook.me/dune/vol1/2",
  },
  {
    id: "book-3",
    title: "1984",
    description: "Джордж Оруэллдің тоталитарлық қоғамда өмір сүру туралы антиутопиялық роман. Уинстон Смиттің оқиғасы - бұл адамзат еркіндігі мен ақиқат туралы терең ойлар туғызатын классикалық шығарма.",
    coverImage: "/placeholder.svg",
    type: "book",
    rating: 8.6,
    year: 1949,
    genre: ["Драма", "Ғылыми фантастика"],
    popularity: 93,
  },
  {
    id: "book-5",
    title: "Project Hail Mary",
    description: "Энди Уирдің адамзатты құтқару үшін жалғыз астронавттың ғарыштағы оқиғалары туралы ғылыми-фантастикалық романы. Райленд Грейс өзінің жадты жоғалтып, жерден алыс планетада оянады. Оның миссиясы - адамзатты құтқару.",
    coverImage: "/project-hail-mary-book.png",
    type: "book",
    rating: 8.7,
    year: 2021,
    genre: ["Ғылыми фантастика"],
    popularity: 91,
    watchUrl: "https://liteka.ru/english/library/4141-project-hail-mary",
  },
  {
    id: "book-6",
    title: "The Three-Body Problem",
    description: "Лю Цысиньнің қытайлық ғалымдардың жерден тыс өмірді табу туралы ғылыми-фантастикалық романы. Бұл трилогияның бірінші кітабы физика, тарих және философияны біріктіретін керемет шығарма.",
    coverImage: "/three-body-problem-book.jpg",
    type: "book",
    rating: 8.6,
    year: 2008,
    genre: ["Ғылыми фантастика"],
    popularity: 90,
    watchUrl: "https://libcat.ru/knigi/fantastika-i-fjentezi/83807-cixin-liu-the-three-body-problem.html",
  },
  {
    id: "book-7",
    title: "To Kill a Mockingbird",
    description: "Харпер Лидің отарлық Алабамада өткен оқиға туралы романы. Аттикус Финч заңгер ретінде әділдік үшін күреседі. Бұл кітап нәсілшілдік, әділдік және адамгершілік туралы терең ойлар туғызады.",
    coverImage: "/the-shawshank-redemption.png",
    type: "book",
    rating: 8.8,
    year: 1960,
    genre: ["Драма"],
    popularity: 94,
  },
  {
    id: "book-8",
    title: "The Great Gatsby",
    description: "Ф. Скотт Фицджеральдтың 1920-жылдардағы Америка туралы романы. Джей Гэтсбидің оқиғасы - бұл американдық арман, махаббат және әлеуметтік сынып туралы классикалық шығарма.",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "book",
    rating: 8.3,
    year: 1925,
    genre: ["Драма", "Романтика"],
    popularity: 89,
  },
  {
    id: "book-9",
    title: "Pride and Prejudice",
    description: "Джейн Остиннің 19 ғасырдағы Англияда өткен романтикалық романы. Элизабет Беннет пен мистер Дарсидің оқиғасы - бұл махаббат, құндылықтар және әлеуметтік нормалар туралы классикалық шығарма.",
    coverImage: "/inception-movie-poster.png",
    type: "book",
    rating: 8.5,
    year: 1813,
    genre: ["Романтика", "Драма"],
    popularity: 92,
  },
  {
    id: "book-10",
    title: "The Catcher in the Rye",
    description: "Дж.Д. Сэлинджердің жасөспірім туралы романы. Холден Колфилдтің оқиғасы - бұл жасөспірімдік, қоғамнан бөліну және өзін табу туралы терең ойлар туғызатын шығарма.",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "book",
    rating: 8.1,
    year: 1951,
    genre: ["Драма"],
    popularity: 87,
  },
  {
    id: "book-11",
    title: "The Hobbit",
    description: "Дж.Р.Р. Толкиннің Бильбо Бэггинстің оқиғасы туралы фэнтези романы. Ол гномдармен бірге қазына іздеуге шығады. Бұл Орта жер әлемінің алғашқы оқиғасы, достық пен батылдық туралы.",
    coverImage: "/the-lord-of-the-rings.png",
    type: "book",
    rating: 8.7,
    year: 1937,
    genre: ["Фэнтези", "Шытырман"],
    popularity: 93,
  },
  {
    id: "book-12",
    title: "Brave New World",
    description: "Олдос Хакслидің болашақ қоғам туралы антиутопиялық романы. Бұл қоғамда адамдар бақытты, бірақ еркіндігі жоқ. Бұл шығарма технология, қоғам және адамзат табиғаты туралы терең ойлар туғызады.",
    coverImage: "/the-matrix.png",
    type: "book",
    rating: 8.2,
    year: 1932,
    genre: ["Ғылыми фантастика", "Драма"],
    popularity: 88,
  },
  {
    id: "book-13",
    title: "The Handmaid's Tale",
    description: "Маргарет Этвудтың тоталитарлық қоғамдағы әйелдер туралы антиутопиялық романы. Оффреддің оқиғасы - бұл әйелдердің құқықтары, билік және қарсылық туралы күшті шығарма.",
    coverImage: "/pulp-fiction.png",
    type: "book",
    rating: 8.4,
    year: 1985,
    genre: ["Ғылыми фантастика", "Драма"],
    popularity: 90,
    watchUrl: "https://linguabooster.com/ru/en/book/the-robbers",
  },
  {
    id: "book-14",
    title: "The Kite Runner",
    description: "Халед Хоссейнидің Афганистанда өткен достық пен кешірім туралы романы. Амир мен Хасанның оқиғасы - бұл достық, қылмыс және кешірім туралы терең эмоционалды шығарма.",
    coverImage: "/the-godfather.png",
    type: "book",
    rating: 8.3,
    year: 2003,
    genre: ["Драма"],
    popularity: 89,
  },
  {
    id: "book-15",
    title: "The Alchemist",
    description: "Пауло Коэльоның мақсат пен арман туралы философиялық романы. Сантьяго шығысқа саяхат жасап, өз тағдырын табады. Бұл кітап өмір мағынасы, арман және тағдыр туралы терең ойлар туғызады.",
    coverImage: "/schindler`s-list.png",
    type: "book",
    rating: 8.0,
    year: 1988,
    genre: ["Философия", "Шытырман"],
    popularity: 86,
  },
  {
    id: "book-16",
    title: "Sapiens",
    description: "Юваль Ной Хараридің адамзат тарихы туралы ғылыми кітабы. Ол адамзаттың эволюциясынан бастап қазіргі заманға дейінгі тарихын баяндайды. Бұл кітап тарих, философия және ғылымды біріктіреді.",
    coverImage: "/images/posters/oppenheimer-poster.png",
    type: "book",
    rating: 8.5,
    year: 2011,
    genre: ["Тарих", "Философия"],
    popularity: 91,
  },
  {
    id: "book-17",
    title: "The Martian",
    description: "Энди Уирдің Марста қалған астронавт туралы ғылыми-фантастикалық романы. Марк Уотни өзін құтқару үшін ғылым мен инженерлік білімді пайдаланады. Керемет ғылыми дәлдік және юмор.",
    coverImage: "/starfield-game-cover.png",
    type: "book",
    rating: 8.4,
    year: 2011,
    genre: ["Ғылыми фантастика"],
    popularity: 90,
    watchUrl: "https://liteka.ru/english/library/3521-the-martian-a-novel",
  },
  {
    id: "book-18",
    title: "The Name of the Wind",
    description: "Патрик Ротфусттың фэнтези романы. Квотедің оқиғасы - бұл сиқыр, музыка және өмір оқиғалары туралы эпикалық фэнтези. Керемет ойластырылған әлем және терең персонаждар.",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "book",
    rating: 8.6,
    year: 2007,
    genre: ["Фэнтези"],
    popularity: 92,
  },
]

export const mockGames: MediaItem[] = [
  {
    id: "2",
    title: "The Witcher 3: Wild Hunt",
    description: "Фэнтези әлемінде өтетін ашық әлемдік RPG, Геральттың шытырман оқиғалары. Ойында сіз монстрларды аулайтын, тапсырмаларды орындайтын және күрделі таңдаулар жасайтын Ведьмак рөлінде боласыз. Керемет графика, терең оқиға және бай әлем.",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game",
    rating: 9.3,
    year: 2015,
    genre: ["Рөлдік ойын", "Шытырман"],
    popularity: 98,
    watchUrl: "https://fogplay.mts.ru/computer/the-witcher-3-wild-hunt/",
  },
  {
    id: "game-5",
    title: "Red Dead Redemption 2",
    description: "Американың қатал жүрегіндегі өмір туралы эпикалық оқиға, бандиттер дәуірінің соңы. Артур Морган рөлінде сіз дикий батыс әлемінде өмір сүресіз. Керемет графика, терең персонаждар және ашық әлемдік ойын механикасы.",
    coverImage: "/red-dead-redemption-2.jpg",
    type: "game",
    rating: 9.7,
    year: 2018,
    genre: ["Шытырман", "Экшен"],
    popularity: 98,
    watchUrl: "https://www.rockstargames.com/ru/reddeadonline",
  },
  {
    id: "game-6",
    title: "God of War",
    description: "Скандинавия мифологиясында өтетін Крейтостың жаңа оқиғалары. Ол енді әке болып, ұлы Атрейсті алып жүреді. Бұл ойында отбасылық қарым-қатынас, өсу және кешірім туралы терең ойлар бар. Керемет графика және ойын механикасы.",
    coverImage: "/god-of-war-game-cover.jpg",
    type: "game",
    rating: 9.5,
    year: 2018,
    genre: ["Шытырман", "Рөлдік ойын"],
    popularity: 97,
    watchUrl: "https://sirus.one/?utm_source=yandex&utm_medium=cpc&utm_campaign=72007854&utm_content=17031382173&utm_term=играть+игры+онлайн+бесплатно&ybaip=1&yclid=14565237818767441919",
  },
  {
    id: "game-7",
    title: "Elden Ring",
    description: "FromSoftware және Джордж Р.Р. Мартин әзірлеген экшн RPG. Бұл қиын, бірақ сізді қызықтыратын ойын. Ашық әлемдік фэнтези әлемінде өз жолыңызды табыңыз. Керемет дизайн, қиын соғыстар және терең ойын механикасы.",
    coverImage: "/generic-fantasy-game-cover.png",
    type: "game",
    rating: 9.1,
    year: 2022,
    genre: ["Рөлдік ойын", "Фэнтези"],
    popularity: 96,
    watchUrl: "https://fogplay.mts.ru/computer/elden-ring-nightreign/",
  },
  {
    id: "game-8",
    title: "Starfield",
    description: "Ғарышты зерттеуге арналған ашық әлемдік RPG. Сіз ғарыш кемесін басқарып, планеталарды зерттейсіз, тапсырмаларды орындайсыз және жаңа әлемдерді ашасыз. Bethesda Game Studios-тың ең соңғы жұмысы.",
    coverImage: "/starfield-game-cover.png",
    type: "game",
    rating: 8.5,
    year: 2023,
    genre: ["Ғылыми фантастика", "Рөлдік ойын"],
    popularity: 89,
  },
  {
    id: "game-9",
    title: "Cyberpunk 2077",
    description: "Болашақтың Night City қаласында өтетін кіберпанк RPG. V рөлінде сіз қаланың қылмыстық әлемінде өмір сүресіз. Керемет графика, терең оқиға және көптеген таңдаулар. Кібернетикалық модификациялар мен керемет технологиялар.",
    coverImage: "/the-matrix.png",
    type: "game",
    rating: 8.8,
    year: 2020,
    genre: ["Рөлдік ойын", "Ғылыми фантастика"],
    popularity: 92,
  },
  {
    id: "game-10",
    title: "Baldur's Gate 3",
    description: "Dungeons & Dragons әлемінде өтетін тактикалық RPG. Сіз өз командаңызды басқарып, күрделі тапсырмаларды орындайсыз. Керемет диалогтар, терең ойын механикасы және көптеген таңдаулар. Larian Studios-тың шедевры.",
    coverImage: "/fantasy-rpg-cover.png",
    type: "game",
    rating: 9.4,
    year: 2023,
    genre: ["Рөлдік ойын", "Тактика"],
    popularity: 97,
    watchUrl: "https://fogplay.mts.ru/computer/baldurs-gate-3/",
  },
  {
    id: "game-11",
    title: "The Last of Us Part II",
    description: "Постапокалиптикалық әлемде өтетін шытырман ойын. Эллидің оқиғасы - бұл кек, кешірім және адамзат табиғаты туралы терең ойлар туғызатын ойын. Керемет графика, эмоционалды оқиға және күшті персонаждар.",
    coverImage: "/last-of-us-series-poster.jpg",
    type: "game",
    rating: 9.0,
    year: 2020,
    genre: ["Шытырман", "Экшен"],
    popularity: 95,
    watchUrl: "https://fogplay.mts.ru/computer/the-last-of-us-part-ii-remastered/",
  },
  {
    id: "game-12",
    title: "Horizon Zero Dawn",
    description: "Роботтар мен адамдардың бірге тұратын болашақ әлемінде өтетін ашық әлемдік RPG. Элой рөлінде сіз роботтарды аулайтын, әлемді зерттейтін және көне сырларды ашатын қаһармансыз. Керемет графика және терең оқиға.",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "game",
    rating: 8.9,
    year: 2017,
    genre: ["Рөлдік ойын", "Ғылыми фантастика"],
    popularity: 93,
  },
  {
    id: "game-13",
    title: "Ghost of Tsushima",
    description: "Феодалдық Жапонияда өтетін самурай ойыны. Джин Сакай рөлінде сіз моңғол басқыншыларына қарсы күресесіз. Керемет графика, керемет соғыс механикасы және терең оқиға. Самурай кодексі мен қажеттілік арасындағы таңдау.",
    coverImage: "/god-of-war-game-cover.jpg",
    type: "game",
    rating: 8.7,
    year: 2020,
    genre: ["Экшен", "Шытырман"],
    popularity: 91,
  },
  {
    id: "game-14",
    title: "Assassin's Creed Valhalla",
    description: "Викингтер дәуірінде өтетін ашық әлемдік ойын. Эйвор рөлінде сіз Англияны басып алуға көмектесесіз. Керемет графика, бай әлем және терең ойын механикасы. Викингтер мәдениеті мен тарихы туралы.",
    coverImage: "/red-dead-redemption-2.jpg",
    type: "game",
    rating: 8.5,
    year: 2020,
    genre: ["Экшен", "Рөлдік ойын"],
    popularity: 89,
  },
  {
    id: "game-15",
    title: "Spider-Man",
    description: "Марвелдің суперқаһарманы туралы ашық әлемдік ойын. Питер Паркер рөлінде сіз Нью-Йорк қаласын қорғайсыз. Керемет графика, керемет жүру механикасы және терең оқиға. Insomniac Games-тың шедевры.",
    coverImage: "/dark-knight-inspired-poster.png",
    type: "game",
    rating: 8.8,
    year: 2018,
    genre: ["Экшен", "Суперқаһарман"],
    popularity: 92,
  },
  {
    id: "game-16",
    title: "Death Stranding",
    description: "Хидео Кодзиманың постапокалиптикалық әлемде өтетін ойыны. Сэм Портер Бриджес рөлінде сіз жүк тасымалдайтын курьерсіз. Бұл ойын байланыс, оқшаулану және адамзат туралы терең ойлар туғызады.",
    coverImage: "/inception-movie-poster.png",
    type: "game",
    rating: 8.6,
    year: 2019,
    genre: ["Экшен", "Ғылыми фантастика"],
    popularity: 88,
  },
  {
    id: "game-17",
    title: "Sekiro: Shadows Die Twice",
    description: "FromSoftware-дың феодалдық Жапонияда өтетін экшен ойыны. Вольф рөлінде сіз құлын құтқару үшін күресесіз. Бұл қиын, бірақ сізді қызықтыратын ойын. Керемет соғыс механикасы және терең ойын дизайны.",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "game",
    rating: 9.0,
    year: 2019,
    genre: ["Экшен", "Шытырман"],
    popularity: 94,
  },
  {
    id: "game-18",
    title: "Hades",
    description: "Греция мифологиясында өтетін roguelike ойын. Загрей рөлінде сіз астыңғы дүниеден шығуға тырысасыз. Керемет графика, керемет ойын механикасы және терең оқиға. Әр ойында жаңа оқиғалар мен таңдаулар.",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game",
    rating: 9.0,
    year: 2020,
    genre: ["Roguelike", "Экшен"],
    popularity: 93,
  },
  {
    id: "game-19",
    title: "Half-Life: Alyx",
    description: "VR технологиясымен жасалған ғылыми-фантастикалық ойын. Аликс Вэнс рөлінде сіз Комбайн басқыншыларына қарсы күресесіз. Керемет VR тәжірибесі, терең оқиға және инновациялық ойын механикасы.",
    coverImage: "/images/posters/oppenheimer-poster.png",
    type: "game",
    rating: 9.2,
    year: 2020,
    genre: ["VR", "Ғылыми фантастика"],
    popularity: 90,
  },
  {
    id: "game-20",
    title: "It Takes Two",
    description: "Екі ойыншыға арналған кооперативтік ойын. Коди мен Мэй рөлінде сіз отбасылық мәселелерді шешуге көмектесесіз. Керемет ойын механикасы, эмоционалды оқиға және керемет графика. Отбасылық қарым-қатынас туралы.",
    coverImage: "/the-shawshank-redemption.png",
    type: "game",
    rating: 8.9,
    year: 2021,
    genre: ["Кооператив", "Шытырман"],
    popularity: 91,
  },
]

// Материалдарды файлдан жүктеу (егер бар болса) немесе бастапқы мәліметтерден
function initializeMedia() {
  const saved = loadMediaFromFile()
  if (saved) {
    // Тип бойынша қосымша фильтрлеу - материалдар дұрыс массивтерге бөлінуі керек
    return {
      movies: saved.movies ? saved.movies.filter((item: MediaItem) => item.type === "movie") : [],
      books: saved.books ? saved.books.filter((item: MediaItem) => item.type === "book") : [],
      games: saved.games ? saved.games.filter((item: MediaItem) => item.type === "game") : [],
    }
  }
  // Егер файл жоқ болса, бастапқы мәліметтерден бастау
  return {
    movies: [...mockMovies],
    books: [...mockBooks],
    games: [...mockGames],
  }
}

const initialMedia = initializeMedia()
let movies = initialMedia.movies
let books = initialMedia.books
let games = initialMedia.games

// Бастапқы мәліметтерді файлға сақтау (егер файл жоқ болса)
const saved = loadMediaFromFile()
if (!saved) {
  // Файл жоқ - бастапқы mock мәліметтерді файлға сақтау
  movies = [...mockMovies]
  books = [...mockBooks]
  games = [...mockGames]
  saveMediaToFile(movies, books, games)
} else {
  // Файл бар - файлдан жүктеу
  refreshMediaFromFile()
}

export async function getMediaItems(type?: "movie" | "book" | "game"): Promise<MediaItem[]> {
  // Файл жоқ болса, бастапқы мәліметтерді файлға сақтау
  const saved = loadMediaFromFile()
  if (!saved) {
    // Файл жоқ - бастапқы мәліметтерден бастау және файлға сақтау
    movies = [...mockMovies]
    books = [...mockBooks]
    games = [...mockGames]
    saveMediaToFile(movies, books, games)
  } else {
    // Файл бар - файлдан жаңарту
    refreshMediaFromFile()
    
    // Егер массивтер бос болса, бастапқы мәліметтерден қалпына келтіру
    const allItemsCount = movies.length + books.length + games.length
    if (allItemsCount === 0) {
      // Барлық материалдарды бастапқы мәліметтерден қалпына келтіру
      movies = [...mockMovies]
      books = [...mockBooks]
      games = [...mockGames]
      saveMediaToFile(movies, books, games)
    }
  }
  
  // Тип бойынша фильтрлеу (қосымша қорғау)
  if (type === "movie") {
    const filtered = movies.filter((item) => item.type === "movie")
    // Егер фильмдер жоқ болса, бастапқы мәліметтерден қалпына келтіру
    if (filtered.length === 0) {
      movies = [...mockMovies]
      saveMediaToFile(movies, books, games)
      return movies.filter((item) => item.type === "movie")
    }
    return filtered
  }
  if (type === "book") {
    const filtered = books.filter((item) => item.type === "book")
    if (filtered.length === 0) {
      books = [...mockBooks]
      saveMediaToFile(movies, books, games)
      return books.filter((item) => item.type === "book")
    }
    return filtered
  }
  if (type === "game") {
    const filtered = games.filter((item) => item.type === "game")
    if (filtered.length === 0) {
      games = [...mockGames]
      saveMediaToFile(movies, books, games)
      return games.filter((item) => item.type === "game")
    }
    return filtered
  }
  return [...movies, ...books, ...games]
}

export async function getMediaItem(id: string): Promise<MediaItem | null> {
  // Файлдан жаңарту
  refreshMediaFromFile()
  
  const allItems = [...movies, ...books, ...games]
  return allItems.find((item) => item.id === id) || null
}

export async function createMediaItem(item: Omit<MediaItem, "id"> & { id?: string }): Promise<MediaItem> {
  // Файлдан жаңарту
  refreshMediaFromFile()
  
  // Дубликаттарды тексеру: бірдей тақырып пен типі бар материал бар ма?
  const allItems = [...movies, ...books, ...games]
  const existingItem = allItems.find(
    (existing) => 
      existing.title.toLowerCase().trim() === item.title.toLowerCase().trim() && 
      existing.type === item.type
  )

  if (existingItem) {
    throw new Error(`"${item.title}" деген ${item.type === "movie" ? "фильм" : item.type === "book" ? "кітап" : "ойын"} қазірдің өзінде бар`)
  }

  const newItem: MediaItem = {
    id: item.id || Date.now().toString(),
    ...item,
  }

  if (item.type === "movie") {
    movies.push(newItem)
  } else if (item.type === "book") {
    books.push(newItem)
  } else if (item.type === "game") {
    games.push(newItem)
  }

  // Файлға сақтау
  saveMediaToFile(movies, books, games)

  return newItem
}

export async function updateMediaItem(id: string, item: Partial<Omit<MediaItem, "id">>): Promise<MediaItem | null> {
  // Файлдан жаңарту
  refreshMediaFromFile()
  
  const allItems = [...movies, ...books, ...games]
  const index = allItems.findIndex((i) => i.id === id)

  if (index === -1) return null

  const updated = { ...allItems[index], ...item } as MediaItem

  if (updated.type === "movie") {
    const movieIndex = movies.findIndex((m) => m.id === id)
    if (movieIndex !== -1) movies[movieIndex] = updated
  } else if (updated.type === "book") {
    const bookIndex = books.findIndex((b) => b.id === id)
    if (bookIndex !== -1) books[bookIndex] = updated
  } else if (updated.type === "game") {
    const gameIndex = games.findIndex((g) => g.id === id)
    if (gameIndex !== -1) games[gameIndex] = updated
  }

  // Файлға сақтау
  saveMediaToFile(movies, books, games)

  return updated
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  // Файлдан жаңарту
  refreshMediaFromFile()
  
  const allItems = [...movies, ...books, ...games]
  const item = allItems.find((i) => i.id === id)

  if (!item) return false

  if (item.type === "movie") {
    movies = movies.filter((m) => m.id !== id)
  } else if (item.type === "book") {
    books = books.filter((b) => b.id !== id)
  } else if (item.type === "game") {
    games = games.filter((g) => g.id !== id)
  }

  // Файлға сақтау
  saveMediaToFile(movies, books, games)

  return true
}

export async function searchMediaItems(query: string): Promise<MediaItem[]> {
  const allItems = [...movies, ...books, ...games]
  const lowerQuery = query.toLowerCase()

  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.genre.some((g) => g.toLowerCase().includes(lowerQuery))
  )
}

// Материалдарды дұрыс типке бөлу және файлға сақтау (жоғалған материалдарды қалпына келтіру үшін)
export async function reorganizeMedia(): Promise<{ movies: number; books: number; games: number }> {
  // Барлық материалдарды біріктіру
  const allItems = [...movies, ...books, ...games, ...mockMovies, ...mockBooks, ...mockGames]
  
  // Барлық дубликаттарды алып тастау (ID бойынша)
  const uniqueItemsMap = new Map<string, MediaItem>()
  for (const item of allItems) {
    if (!uniqueItemsMap.has(item.id)) {
      uniqueItemsMap.set(item.id, item)
    }
  }
  
  // Тип бойынша дұрыс бөлу
  movies = Array.from(uniqueItemsMap.values()).filter((item) => item.type === "movie")
  books = Array.from(uniqueItemsMap.values()).filter((item) => item.type === "book")
  games = Array.from(uniqueItemsMap.values()).filter((item) => item.type === "game")
  
  // Файлға сақтау
  saveMediaToFile(movies, books, games)
  
  return {
    movies: movies.length,
    books: books.length,
    games: games.length,
  }
}

// Дубликаттарды тауып жою: бірдей тақырып пен типі бар материалдарды жояды
export async function removeDuplicates(): Promise<{ removed: number; duplicates: Array<{ title: string; type: string; ids: string[] }> }> {
  // Файлдан жаңарту
  refreshMediaFromFile()
  
  const allItems = [...movies, ...books, ...games]
  const duplicatesMap = new Map<string, MediaItem[]>()
  
  // Барлық материалдарды топтастыру (тақырып + тип бойынша)
  for (const item of allItems) {
    const key = `${item.title.toLowerCase().trim()}_${item.type}`
    if (!duplicatesMap.has(key)) {
      duplicatesMap.set(key, [])
    }
    duplicatesMap.get(key)!.push(item)
  }

  // Дубликаттарды табу (бірдей тақырып пен типі бар 1-ден көп материал)
  const duplicates: Array<{ title: string; type: string; ids: string[] }> = []
  let removedCount = 0

  for (const [key, items] of duplicatesMap.entries()) {
    if (items.length > 1) {
      const [firstItem, ...duplicateItems] = items
      const typeLabel = firstItem.type === "movie" ? "фильм" : firstItem.type === "book" ? "кітап" : "ойын"
      
      duplicates.push({
        title: firstItem.title,
        type: typeLabel,
        ids: items.map(i => i.id)
      })

      // Біріншісін қалдырып, қалған дубликаттарды жою
      for (const duplicateItem of duplicateItems) {
        if (duplicateItem.type === "movie") {
          movies = movies.filter(m => m.id !== duplicateItem.id)
        } else if (duplicateItem.type === "book") {
          books = books.filter(b => b.id !== duplicateItem.id)
        } else if (duplicateItem.type === "game") {
          games = games.filter(g => g.id !== duplicateItem.id)
        }
        removedCount++
      }
    }
  }

  // Файлға сақтау
  saveMediaToFile(movies, books, games)

  return {
    removed: removedCount,
    duplicates
  }
}





