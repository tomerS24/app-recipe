import { useState, useEffect } from 'react'
import { collectionNames, projectFirestore } from '../../firebase/config'
import RecipeList from '../../components/RecipeList'

// styles
import './Home.css'
import Searchbar from '../../components/Searchbar'
import RecipeFilter from './RecipeFilter'

export default function Home({user}) {
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('all')

  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  const recipes = data ? data.filter(document => {
    switch(filter) {
      case 'all':
        return true
      case 'mine':
        return document.userId === user.uid
      default:
        console.log(document.category, filter)
        return document.category.label === filter
    }
  }) : null

  useEffect(() => {
    setIsPending(true)

    const unsub = projectFirestore.collection(collectionNames.recipes).onSnapshot(snapshot => {
      if (snapshot.empty) {
        setError('No recipes to load')
        setIsPending(false)
      } else {
        let results = []
        snapshot.docs.forEach(doc => {
          // console.log(doc)
          results.push({ ...doc.data(), id: doc.id })
        })
        setData(results)
        setIsPending(false)
      }
    }, err => {
      setError(err.message)
      setIsPending(false)
    })

    return () => unsub()

  }, [])

  return (
    <div>
      
      <div className="home">
        {error && <p className="error">{error}</p>}
        {isPending && <p className="loading">Loading...</p>}
        {data && <RecipeFilter changeFilter={changeFilter} />}
        {recipes && <RecipeList user={user} recipes={recipes} />}
      </div>
    </div>
  )
}
