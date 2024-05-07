import { useState } from "react";
import "./App.css";
import {
  Button,
  Container,
  Input,
  Stack,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { useToast } from '@chakra-ui/react';


function App() {
  const [url, setUrl] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const toast = useToast();


  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };
  const fetchData = () => {
    setIsLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setJsonData(JSON.stringify(data, null, 2));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        toast({
          title: "Error",
          description: `Failed to fetch data: ${error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left"
        });
        setIsLoading(false);
      });
  };
  
  

  const renderHTML = () => {
    if (!jsonData) return;
    const createHTMLFromObject = (obj) => {
      let htmlContent = "<div style='white-space: pre-wrap;'>";
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          htmlContent += `<div><strong>${key}:</strong> ${createHTMLFromObject(value)}</div>`;
        } else {
          htmlContent += `<div><strong>${key}:</strong> ${value}</div>`;
        }
      });
      htmlContent += '</div>';
      return htmlContent;
    };
    const data = JSON.parse(jsonData);
    const htmlOutput = createHTMLFromObject(data);
    const sanitizedContent = DOMPurify.sanitize(htmlOutput);
    setRenderedContent(sanitizedContent);
  };

 const renderMarkdown = () => {
  if (!jsonData) return;

  const data = JSON.parse(jsonData);
  let markdownContent = "### Markdown Data\n\n"; // Markdown heading

  // Iterate through the object and format as list
  Object.entries(data).forEach(([key, value]) => {
    markdownContent += `- **${key}**: ${value}\n`;
  });

  const sanitizedContent = DOMPurify.sanitize(markdownContent);
  setRenderedContent(sanitizedContent);
};

  return (
    <>
      <Container maxW="1050px" mt="60px">
        <Flex align="center">
          {" "}
          {/* Flex container with some gap and alignment */}
          <Input
            placeholder="medium size"
            size="md"
            w="80%"
            onChange={handleInputChange}
          />
          <Button background={" #18A0FB"} color={"#FFFFFF"} onClick={fetchData}>
            Get
          </Button>
        </Flex>
      </Container>
        
        <Container maxW={"1050px"} mt="20px">
          <Flex justifyContent={"space-around"}>
      <div  style={{width: "400px"}}  >
        <Heading as="h1" size="1xl" noOfLines={1} mb={"35px"}>
          JSON
        </Heading>
        <Textarea
          placeholder="Here is a sample placeholder"
            value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          height={"500px"}
        />
      </div>

      <div style={{width: "400px"}}>
        <HStack gap={"20px"} display={"flex"} mb={"20px"}>
           <Button background={" #18A0FB"} color={"#FFFFFF"}
           onClick={renderHTML}>
            HTML
           </Button >
           <Button background={" #18A0FB"} color={"#FFFFFF"} onClick={renderMarkdown}>
            Markdown
           </Button>
           </HStack>
        <Textarea
          placeholder="Here is a sample placeholder"
          w={"100%"}
          value={renderedContent}
          readOnly
          height={"500px"}
        />
      </div>
      </Flex>
      </Container>
    </>
  );
}

export default App;
