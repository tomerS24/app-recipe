import { Link, useParams } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useState, useEffect } from 'react'
import { collectionNames, projectFirestore } from '../../firebase/config'
import FontAwesome from "react-fontawesome";
import Trashcan from '../../assets/trashcan.svg'

// styles
import './Recipe.css'

export default function Recipe({user}) {
  const { id } = useParams()
  const { mode } = useTheme()

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    setIsPending(true)

    const unsub = projectFirestore.collection(collectionNames.recipes).doc(id).onSnapshot(doc => {
      if (doc.exists) {
        setIsPending(false)
        setRecipe(doc.data())
      } else {
        setIsPending(false)
        setError(`Could not find that recipe`)
      }
    })

    return () => unsub()

  }, [id])

  const addLike = () => {
    recipe.likes.push(user.uid);
    projectFirestore.collection(collectionNames.recipes).doc(id).update({ likes: recipe.likes });
  }

  const deleteLike = () => {
    projectFirestore.collection(collectionNames.recipes).doc(id).update({ likes: recipe.likes.filter(x=>x!==user.uid) })
  }

  return (
    <div className={`recipe ${mode}`}>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {recipe && (
        <>
        <div>
          <h2 className="page-title">{recipe.title}</h2>
          <p>{recipe.category.label}</p>
          <p>Takes {recipe.cookingTime} to cook.</p>
          <ul>
            {recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
          </ul>
          <p style={{ textAlign: "center" }} className="method">{recipe.method}</p>
          
          <div style={{ float: "right" }}>
            {
              (user?.uid === recipe.userId) && 
              <FontAwesome
                name="trash"
                style={{ margin: "5px", cursor: "pointer", color: "red"}}
                size="2x"
                onClick={() => console.log(id)}
              />
            }
            {
              (user?.uid === recipe.userId) && 
              <Link to={`/update/${id}`}>
                <FontAwesome
                  name="edit"
                  style={{ margin: "5px", cursor: "pointer", color: 'green'}}
                  size="2x"
                />
              </Link>
            }
            {
              (user?.uid !== recipe.userId) && recipe.likes.includes(user.uid) && 
              <FontAwesome
                name="fa-solid fa-heart"
                style={{ margin: "5px", cursor: "pointer", color: "red" }}
                size="2x"
                onClick={() => deleteLike()}
              />
            }
            {
              (user?.uid !== recipe.userId) && !recipe.likes.includes(user.uid) && 
              <FontAwesome
                name="fa-regular fa-heart"
                style={{ margin: "5px", cursor: "pointer", color: "black" }}
                size="2x"
                onClick={() => addLike()}
              />
            }
            </div>
          </div>
        </>
      )}
    </div>
  )
}