---
_schema: template_example
title: Template examples
unkeyed:
  - asdasd
keyed:
  - type: Marsupial
    name: Kangaroo
  - type: Reptile
    name: 🐍
  - type: Marsupial
    name: Koala
  - type: Reptile
    name: Snake
  - type: Reptile
    name: Lizard
  - type: Fish
    name: Goldfish
empty_unkeyed: []
empty_keyed:
  - type: Fish
    name: 🐟
multi_element_unkeyed:
  - Tiger
  - Lion
multi_element_keyed:
  - type: Marsupial
    name: Wombat
  - type: Reptile
    name: Crocodile
empty_multi_element_unkeyed: []
empty_multi_element_keyed: []
_inputs:
  unkeyed:
    type: array
  unkeyed[*]:
    type: text
  keyed:
    type: array
    options:
      structures: _structures.keyed
  empty_unkeyed:
    type: array
  empty_unkeyed[*]:
    type: text
  empty_keyed:
    type: array
    options:
      structures: _structures.keyed
  multi_element_unkeyed:
    type: array
  multi_element_unkeyed[*]:
    type: text
  multi_element_keyed:
    type: array
    options:
      structures: _structures.keyed
  empty_multi_element_unkeyed:
    type: array
  empty_multi_element_unkeyed[*]:
    type: text
  empty_multi_element_keyed:
    type: array
    options:
      structures: _structures.keyed
_structures:
  keyed:
    id_key: type
    values:
      - value:
          type: Marsupial
          name: 🐨
        label: Marsupial
      - value:
          type: Reptile
          name: 🐍
        label: Reptile
      - value:
          type: Fish
          name: 🐟
        label: Fish
---
<h1>Web Components</h1>
<h2>Unkeyed</h2>
<editable-array data-prop="unkeyed">
    <template>
        <editable-array-item><editable-text data-prop=""></editable-text></editable-array-item>
    </template>
</editable-array>  
<h2>Keyed</h2>
<editable-array data-prop="keyed" data-id-key="type">
    <template data-id="Marsupial">
        <editable-array-item>
            <p>🐨🐨🐨<editable-text data-prop="name"></editable-text>🐨🐨🐨</p>
        </editable-array-item>
    </template>
    <template data-id="Reptile">
        <editable-array-item>
            <p>🐍🐍🐍<editable-text data-prop="name"></editable-text>🐍🐍🐍</p>
        </editable-array-item>
    </template>
    <template data-id="Fish">
        <editable-array-item>
            <p>🐟🐟🐟<editable-text data-prop="name"></editable-text>🐟🐟🐟</p>
        </editable-array-item>
    </template>
</editable-array>
<h2>Empty Unkeyed</h2>
<editable-array data-prop="empty_unkeyed">
    <template>
        <editable-array-item><editable-text data-prop=""></editable-text></editable-array-item>
    </template>
</editable-array>
<h2>Empty Keyed</h2>
<editable-array data-prop="empty_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <editable-array-item>
            <p>🐨🐨🐨<editable-text data-prop="name"></editable-text>🐨🐨🐨</p>
        </editable-array-item>
    </template>
    <template data-id="Reptile">
        <editable-array-item>
            <p>🐍🐍🐍<editable-text data-prop="name"></editable-text>🐍🐍🐍</p>
        </editable-array-item>
    </template>
    <template data-id="Fish">
        <editable-array-item>
            <p>🐟🐟🐟<editable-text data-prop="name"></editable-text>🐟🐟🐟</p>
        </editable-array-item>
    </template>
</editable-array>
<h2>Multi-Element Unkeyed</h2>
<editable-array data-prop="multi_element_unkeyed">
    <template>
        <h3>Animal</h3>
        <div><editable-text data-prop=""></editable-text></div>
        <hr />
    </template>
</editable-array>
<h2>Multi-Element Keyed</h2>
<editable-array data-prop="multi_element_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <h3>Marsupial</h3>
        <div>
            <p>🐨🐨🐨<editable-text data-prop="name"></editable-text>🐨🐨🐨</p>
        </div>
        <hr />
    </template>
    <template data-id="Reptile">
        <h3>Reptile</h3>
        <div>
            <p>🐍🐍🐍<editable-text data-prop="name"></editable-text>🐍🐍🐍</p>
        </div>
        <hr />
    </template>
    <template data-id="Fish">
        <h3>Fish</h3>
        <div>
            <p>🐟🐟🐟<editable-text data-prop="name"></editable-text>🐟🐟🐟</p>
        </div>
        <hr />
    </template>
</editable-array>
<h2>Empty Multi-Element Unkeyed</h2>
<editable-array data-prop="empty_multi_element_unkeyed">
    <template>
        <h3>Animal</h3>
        <div><editable-text data-prop=""></editable-text></div>
        <hr />
    </template>
</editable-array>
<h2>Empty Multi-Element Keyed</h2>
<editable-array data-prop="empty_multi_element_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <h3>Marsupial</h3>
        <div>
            <p>🐨🐨🐨<editable-text data-prop="name"></editable-text>🐨🐨🐨</p>
        </div>
        <hr />
    </template>
    <template data-id="Reptile">
        <h3>Reptile</h3>
        <div>
            <p>🐍🐍🐍<editable-text data-prop="name"></editable-text>🐍🐍🐍</p>
        </div>
        <hr />
    </template>
    <template data-id="Fish">
        <h3>Fish</h3>
        <div>
            <p>🐟🐟🐟<editable-text data-prop="name"></editable-text>🐟🐟🐟</p>
        </div>
        <hr />
    </template>
</editable-array>
<h1>Data Attributes</h1>
<h2>Unkeyed</h2>
<div data-editable="array" data-prop="unkeyed">
    <template>
        <div><span data-editable="text" data-prop=""></span></div>
    </template>
</div>
<h2>Keyed</h2>
<div data-editable="array" data-prop="keyed" data-id-key="type">
    <template data-id="Marsupial">
        <div>
            <p>🐨🐨🐨<span data-editable=text data-prop="name"></span>🐨🐨🐨</p>
        </div>
    </template>
    <template data-id="Reptile">
        <div>
            <p>🐍🐍🐍<span data-editable=text data-prop="name"></span>🐍🐍🐍</p>
        </div>
    </template>
    <template data-id="Fish">
        <div>
            <p>🐟🐟🐟<span data-editable=text data-prop="name"></span>🐟🐟🐟</p>
        </div>
    </template>
</div>
<h2>Empty Unkeyed</h2>
<div data-editable="array" data-prop="empty_unkeyed">
    <template>
        <div><span data-editable="text" data-prop=""></span></div>
    </template>
</div>
<h2>Empty Keyed</h2>
<div data-editable="array" data-prop="empty_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <div>
            <p>🐨🐨🐨<span data-editable=text data-prop="name"></span>🐨🐨🐨</p>
        </div>
    </template>
    <template data-id="Reptile">
        <div>
            <p>🐍🐍🐍<span data-editable=text data-prop="name"></span>🐍🐍🐍</p>
        </div>
    </template>
    <template data-id="Fish">
        <div>
            <p>🐟🐟🐟<span data-editable=text data-prop="name"></span>🐟🐟🐟</p>
        </div>
    </template>
</div>
<h2>Multi-Element Unkeyed</h2>
<div data-editable="array" data-prop="multi_element_unkeyed">
    <template>
        <h3>Animal</h3>
        <div><span data-editable="text" data-prop=""></span></div>
        <hr />
    </template>
</div>
<h2>Multi-Element Keyed</h2>
<div data-editable="array" data-prop="multi_element_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <h3>Marsupial</h3>
        <div>
            <p>🐨🐨🐨<span data-editable=text data-prop="name"></span>🐨🐨🐨</p>
        </div>
        <hr />
    </template>
    <template data-id="Reptile">
        <h3>Reptile</h3>
        <div>
            <p>🐍🐍🐍<span data-editable=text data-prop="name"></span>🐍🐍🐍</p>
        </div>
        <hr />
    </template>
    <template data-id="Fish">
        <h3>Fish</h3>
        <div>
            <p>🐟🐟🐟<span data-editable=text data-prop="name"></span>🐟🐟🐟</p>
        </div>
        <hr />
    </template>
</div>
<h2>Empty Multi-Element Unkeyed</h2>
<div data-editable="array" data-prop="empty_multi_element_unkeyed">
    <template>
        <h3>Animal</h3>
        <div><span data-editable="text" data-prop=""></span></div>
        <hr />
    </template>
</div>
<h2>Empty Multi-Element Keyed</h2>
<div data-editable="array" data-prop="empty_multi_element_keyed" data-id-key="type">
    <template data-id="Marsupial">
        <h3>Marsupial</h3>
        <div>
            <p>🐨🐨🐨<span data-editable=text data-prop="name"></span>🐨🐨🐨</p>
        </div>
        <hr />
    </template>
    <template data-id="Reptile">
        <h3>Reptile</h3>
        <div>
            <p>🐍🐍🐍<span data-editable=text data-prop="name"></span>🐍🐍🐍</p>
        </div>
        <hr />
    </template>
    <template data-id="Fish">
        <h3>Fish</h3>
        <div>
            <p>🐟🐟🐟<span data-editable=text data-prop="name"></span>🐟🐟🐟</p>
        </div>
        <hr />
    </template>
</div>
