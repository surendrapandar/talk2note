const { Client } = require('@notionhq/client');
const express = require("express")
const router = express.Router();

router.post('/', (req, res) => {
  const formData = req.body; // Access form data from request body
  console.log("Form data received:", formData);
  const notion = new Client({ auth: formData.secret});
  res.json({ success: true, message: "Form data received successfully"});
  (async () => {
    const response = await notion.pages.create({
      "cover": {
          "type": "external",
          "external": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
          }
      },
      "icon": {
          "type": "emoji",
          "emoji": "📝"
      },
      "parent": {
          "type": "database_id",
          "database_id": formData.dbid  // Vishnu DB id 
      },
      "properties": {
          "Name": {
              "title": [
                  {
                      "text": {
                          "content": formData.heading
                      }
                  }
              ]
          },
          "description": {
              "rich_text": [
                  {
                      "text": {
                          "content": formData.description
                      }
                  }
              ]
          },

          "notes_source": {
            "rich_text": [
                {
                    "text": {
                        "content": formData.source
                    }
                }
            ]
        },
          "Tags" : {
            "multi_select" : [
              {
                "name" : formData.tag
              }
            ]
            
          }
          
      },

      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{ "type": "text", "text": { "content": formData.voice_output } }]
          }
        },
        
    ]
  });
  
    console.log(response);
    
  })();
})


module.exports = router;


