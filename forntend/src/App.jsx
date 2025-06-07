import Protected from "./Components/Protected"
import Layout from "./layout"

function App() {
  return (
    <Protected shouldBeAuthenticated={true}>
      <Layout />
    </Protected>
  )

}

export default App