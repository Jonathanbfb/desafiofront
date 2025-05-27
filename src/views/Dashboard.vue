<template>
  <v-app>
    <v-main class="dashboard-background">
      <v-container fluid>
        <v-toolbar color="deep-purple accent-4" dark flat>
          <v-toolbar-title class="font-weight-bold"> 🎬 WatchFlix </v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container class="mt-5">
          <h2 class="section-title">🔥 Filmes Populares</h2>
          <v-row>
            <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
              <v-card
                class="movie-card-modern"
                elevation="0"
                color="transparent"
                @click="abrirDetalhes(movie)"
              >
                <v-img
                  :src="getImage(movie.poster_path)"
                  aspect-ratio="2/3"
                  contain
                  class="movie-img"
                />
                <v-card-title class="movie-title">{{ movie.title }}</v-card-title>
                <v-card-subtitle class="movie-overview">
                  {{ movie.overview.slice(0, 80) }}...
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-dialog v-model="modalAberta" max-width="600px" persistent>
          <v-card class="bg-dark">
            <v-img
              :src="getImage(filmeSelecionado?.backdrop_path || filmeSelecionado?.poster_path)"
              height="300px"
              cover
            />
            <v-card-title class="text-h5 text-white">{{ filmeSelecionado?.title }}</v-card-title>
            <v-card-text class="text-grey-lighten-2">
              <p><strong>Sinopse:</strong></p>
              <p>{{ filmeSelecionado?.overview }}</p>
              <p class="mt-4"><strong>Lançamento:</strong> {{ filmeSelecionado?.release_date }}</p>
              <p><strong>Média de votos:</strong> {{ filmeSelecionado?.vote_average }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="pink-accent-2" text @click="modalAberta = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-container class="mt-10">
          <h2 class="section-title">🎯 Recomendados para você</h2>
          <v-alert type="info" border="left" elevation="2" class="mt-4">
            Sistema de recomendação em breve! 😉
          </v-alert>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
}

const movies = ref<Movie[]>([])
const auth = useAuthStore()
const router = useRouter()

const getImage = (path: string): string => `https://image.tmdb.org/t/p/w500${path}`

onMounted(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/popular`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  })
  movies.value = res.data
})

const logout = () => {
  auth.setToken('')
  router.push('/')
}

const marcarComoVisto = async (movieId: number) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/recommendation/select`,
    {
      userId: '1',
      movieId,
    },
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    },
  )
}

const modalAberta = ref(false)
const filmeSelecionado = ref<Movie | null>(null)

const abrirDetalhes = (filme: Movie) => {
  filmeSelecionado.value = filme
  modalAberta.value = true
}
</script>

<style scoped>
.dashboard-background {
  background: linear-gradient(to bottom, #1e1e2f, #3a0ca3);
  min-height: 100vh;
  color: white;
}

.section-title {
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
}

.movie-card {
  transition: 0.3s;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.03);
}

.movie-card-modern {
  border-radius: 20px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  background: transparent;
  backdrop-filter: blur(6px);
}

.movie-card-modern:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

.movie-title {
  font-weight: 600;
  color: #ffffff;
  font-size: 1rem;
  padding-top: 8px;
}

.movie-overview {
  font-size: 0.85rem;
  color: #bcbcbc;
  padding: 0 16px 16px 16px;
  line-height: 1.3;
}

.movie-img {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.04); /* leve contraste */
}

.bg-dark {
  background-color: #1e1e2f !important;
}
</style>
