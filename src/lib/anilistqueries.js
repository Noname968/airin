export const trending =  `
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

export const top100anime =  `
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

export const seasonal =  `
query($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
        }
        media (season: FALL, seasonYear: 2023,sort :POPULARITY_DESC, type : ANIME){
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

export const animeinfo =  `
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
            }
    }
}
    }
  }
`

export const advancedsearch = `
query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
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
