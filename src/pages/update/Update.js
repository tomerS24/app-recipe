import { useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import { collectionNames, projectFirestore } from '../../firebase/config'
import { useNavigate, useParams } from 'react-router-dom';

// styles
import './Update.css'
import { categories } from '../../utils';
import { useTheme } from '../../hooks/useTheme';



export default function Update({user}) {  
  const { id } = useParams()
  const { mode } = useTheme()

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [newIngredient, setNewIngredient] = useState('')
  const ingredientInput = useRef(null)

  const navigate = useNavigate();

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

  const handleChange = (name, value) => {
    setRecipe({ ...recipe, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { title, category, ingredients, method, cookingTime } = recipe;
    const fields = { title, category, ingredients, method, cookingTime };
    try {
      projectFirestore.collection(collectionNames.recipes).doc(id).update(fields);
      navigate('/');
    } catch (err) {
      console.log(err)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const ing = newIngredient.trim()

    if (ing && !recipe.ingredients.includes(ing)) {
      recipe.ingredients.push(newIngredient); 
      setRecipe(recipe);
    }
    setNewIngredient('')
    ingredientInput.current.focus()
  }

  return ( recipe && 
    <div className="create">
      <h2 className="page-title">Update Recipe</h2>
      <form onSubmit={handleSubmit}>

        <label>
          <span>Recipe title:</span>
          <input 
            type="text" 
            onChange={(e) => handleChange('title', e.target.value)}
            value={recipe.title}
            required
          />
        </label>

        <label>
        <span>Category:</span>
          <Select
          value={ recipe.category}
            onChange={(option) => handleChange('category',option)}
            options={categories}
          />
        </label>

        <label>
          <span>Recipe Ingredients:</span>
          <div className="ingredients">
            <input 
              type="text" 
              onChange={(e) => setNewIngredient(e.target.value)}
              value={newIngredient}
              ref={ingredientInput}
            />
            <button onClick={handleAdd} className="btn">add</button>
          </div>
        </label>
        <p>Current ingredients: {recipe.ingredients.map(i => <em key={i}>{i}, </em>)}</p>

        <label>
          <span>Recipe Method:</span>
          <textarea 
            onChange={(e) => handleChange('method', e.target.value)}
            value={recipe.method}
            required
          />
        </label>

        <label>
          <span>Cooking time (minutes):</span>
          <input 
            type="number" 
            onChange={(e) => handleChange('cookingTime', e.target.value)}
            value={recipe.cookingTime}
            required 
          />
        </label>

        <button className="btn">submit</button>
      </form>
    </div>
  )
}
