---
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