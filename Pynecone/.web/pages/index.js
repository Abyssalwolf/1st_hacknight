import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { connect, E, getRefValue, isTrue, preventDefault, refs, updateState, uploadFiles } from "/utils/state"
import "focus-visible/dist/focus-visible"
import { Button, Center, Heading, HStack, useColorMode, VStack } from "@chakra-ui/react"
import NextHead from "next/head"



export default function Component() {
  const [state, setState] = useState({"count": 0, "is_hydrated": false, "events": [{"name": "state.hydrate"}], "files": []})
  const [result, setResult] = useState({"state": null, "events": [], "processing": false})
  const router = useRouter()
  const socket = useRef(null)
  const { isReady } = router
  const { colorMode, toggleColorMode } = useColorMode()
  const focusRef = useRef();
  
  const Event = (events, _e) => {
      preventDefault(_e);
      setState({
        ...state,
        events: [...state.events, ...events],
      })
  }

  const File = files => setState({
    ...state,
    files,
  })

  useEffect(()=>{
    if(!isReady) {
      return;
    }
    if (!socket.current) {
      connect(socket, state, setState, result, setResult, router, ['websocket', 'polling'])
    }
    const update = async () => {
      if (result.state != null){
        setState({
          ...result.state,
          events: [...state.events, ...result.events],
        })

        setResult({
          state: null,
          events: [],
          processing: false,
        })
      }

      await updateState(state, setState, result, setResult, router, socket.current)
    }
    if (focusRef.current)
      focusRef.current.focus();
    update()
  })
  useEffect(() => {
    const change_complete = () => Event([E('state.hydrate', {})])
    router.events.on('routeChangeComplete', change_complete)
    return () => {
      router.events.off('routeChangeComplete', change_complete)
    }
  }, [router])


  return (
    <Center sx={{"paddingY": "5em", "fontSize": "3em", "textAlign": "center"}}>
  <VStack sx={{"padding": "2em", "bg": "#75D9B3", "borderRadius": ".5em", "boxShadow": "10px 10px 8px #888888"}}>
  <Heading>
  {state.count}
</Heading>
  <HStack>
  <Button colorScheme="red" onClick={_e => Event([E("state.decrement", {})], _e)} sx={{"borderRadius": "5em"}}>
  {`Decrement`}
</Button>
  <Button colorScheme="blue" onClick={_e => Event([E("state.random", {})], _e)} sx={{"borderRadius": "5em"}}>
  {`Randomize`}
</Button>
  <Button colorScheme="green" onClick={_e => Event([E("state.increment", {})], _e)} sx={{"borderRadius": "5em"}}>
  {`Increment`}
</Button>
</HStack>
</VStack>
  <NextHead>
  <title>
  {`Counter`}
</title>
  <meta content="A Pynecone app." name="description"/>
  <meta content="favicon.ico" property="og:image"/>
</NextHead>
</Center>
  )
}
