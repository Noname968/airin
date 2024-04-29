export const trending = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (sort :TRENDING_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            description
            bannerImage
            episodes
            status
            duration
            genres
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              trailer {
                id
                site
                thumbnail
              }
        }
    }
}`

export const top100anime = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (sort :SCORE_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            episodes
            status
            duration
            genres
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
        }
    }
}`

export const seasonal = `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (season: SPRING, seasonYear: 2024,sort :POPULARITY_DESC, type : ANIME){
            id
            idMal
            title {
                romaji
                english
                userPreferred
            }
            coverImage {
                large
                extraLarge
                color
            }
            episodes
            status
            duration
            genres
            season
            format
            averageScore
            popularity
            nextAiringEpisode {
                airingAt
                episode
              }
              seasonYear
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
        }
    }
}`

export const animeinfo = `
query ($id: Int) {
    Media (id: $id) {
      id
      idMal
      title {
          romaji
          english
          userPreferred
      }
      coverImage {
          large
          extraLarge
          color
      }
      description
      bannerImage
      episodes
      status
      duration
      genres
      source
      type
      seasonYear
      season
      format
      averageScore
      popularity
      countryOfOrigin
      nextAiringEpisode {
          airingAt
          episode
        }
        seasonYear
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        trailer {
          id
          site
          thumbnail
        }

        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title {
                romaji
                native
                english
              }
              format
              coverImage{
                large
                extraLarge
              }
              episodes
              chapters
              status
            }
          }
      }
      recommendations {
        nodes {
            mediaRecommendation {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    extraLarge
                    large
                }
                episodes
                status
                format
                nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode
                }
            }
    }
}
characters {
  edges { 
    id
    role
    node {
      name {
        first
        last
        full
        native
        userPreferred
      }
      image {
        large
      }
    }
    voiceActorRoles {
      voiceActor {
        id
        name {
          first
          middle
          last
          full
          native
          userPreferred
        }
        image {
          large
        }
      }
    }
  }
}
    }
  }
`

export const advancedsearch = `
query ($page: Int = 1, $id: Int, $type: MediaType, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $episodeLesser: Int, $episodeGreater: Int, $genres: [String], $tags: [String], $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, genre_in: $genres, tag_in: $tags, sort: $sort) {
      id
      title {
        english
        romaji
        userPreferred
      }
      coverImage {
        extraLarge
        large
        color
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      bannerImage
      season
      seasonYear
      description
      type
      format
      status(version: 2)
      episodes
      duration
      chapters
      volumes
      genres
      isAdult
      averageScore
      popularity
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      mediaListEntry {
        id
        status
      }
    }
  }
}`;


export const notifications = `query ($page: Int) {
  Page(page: $page, perPage: 15) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    notifications(resetNotificationCount: true) {
			... on AiringNotification {
				id
				type 
				animeId
				episode
				contexts
				createdAt
				media: media {
					id
					title {
             english
          romaji 
        }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on RelatedMediaAdditionNotification {
				id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaDataChangeNotification {
					id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaMergeNotification {
        id
				type
				mediaId
				context
				createdAt
				media: media {
					id
					title { 
            english
            romaji
           }
					type
					coverImage { large, extraLarge }
		  		}
			}
			... on MediaDeletionNotification {
        id
				type
				context
				createdAt
        deletedMediaTitle
			}
	  	}
	}
}`

export const playeranimeinfo = `query ($id: Int) {
  Media (id: $id) {
    mediaListEntry {
      progress
      status
    }
    id
    idMal
    title {
      romaji
      english
      native
    }
    status
    format
    genres
    episodes
    bannerImage
    description
    coverImage {
      extraLarge
      color
    }
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    recommendations {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
          episodes
          status
          format
          nextAiringEpisode {
            episode
          }
        }
      }
    }
  }
}
`

export const userlists = `
query ($id: Int) {
  Media(id: $id) {
    mediaListEntry {
      id
      status
      score
      progress
      repeat
      notes
      startedAt{
        year 
        month
        day
      }
      completedAt{
        year 
        month
        day
      }
    }
  }
}
`;

export const updatelist = `
mutation (
  $id: Int,
  $mediaId: Int!,
  $progress: Int,
  $status: MediaListStatus,
  $score: Float,
  $notes: String,
  $startedAt: FuzzyDateInput,
  $completedAt: FuzzyDateInput,
  $repeat: Int
) {
  SaveMediaListEntry (
    id: $id,
    mediaId: $mediaId,
    status: $status,
    score: $score,
    progress: $progress,
    notes: $notes,
    startedAt: $startedAt,
    completedAt: $completedAt,
    repeat: $repeat
  ) {
    id
    mediaId
    status
    score
    notes
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    progress
    repeat
  }
}
`

export const userprofile = `
query ($username: String, $status: MediaListStatus) {
  MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
    user {
      id
      name
      about (asHtml: true)
      createdAt
      avatar {
          large
      }
      statistics {
        anime {
            count
            episodesWatched
            minutesWatched
            meanScore
        }
    }
      bannerImage
    }
    lists {
      status
      name
      entries {
        id
        mediaId
        status
      score
      progress
      repeat
      notes
      startedAt{
        year 
        month
        day
      }
      completedAt{
        year 
        month
        day
      }
        updatedAt
        media {
          id
          status
          format
          title {
            english
            romaji
          }
          episodes
          bannerImage
          coverImage {
            extraLarge
          }
        }
      }
    }
  }
}
`

export const schedule = ` 
query($page: Int, $perPage: Int, $from: Int, $to: Int){
  Page(page: $page, perPage: $perPage){
    pageInfo{
      hasNextPage
    },
    airingSchedules(airingAt_greater: $from, airingAt_lesser: $to){
      episode,
      timeUntilAiring,
      airingAt,
      media{
        title
        coverImage{
          extraLarge
        }
        bannerImage
        format,
        status,
        episodes
      }
    }
  }
}`
