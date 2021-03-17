import pug from 'pug'
import path from 'path'
import fs from 'fs'

describe('Email Template', () => {
  it('Compile email template', () => {
    const compiledFunction = pug.compileFile(path.join(__dirname, 'newsletter.pug'))
    const html = compiledFunction({
      userFirstName: 'Mohamed',
      subs: {
        funny: [
          {
            title: 'title1',
            image: {
              url: 'https://preview.redd.it/rktwk0uop1n61.jpg?auto=webp&s=633eebc63d6cfafc30d4975abc82114fa41ea201',
            },
            votes: 300,
            url: 'https://www.reddit.com/r/funny/comments/m6fp40/i_guess_we_have_a_new_appliance/',
          },
          {
            title: 'title2',
            image: {
              url: 'https://preview.redd.it/rktwk0uop1n61.jpg?auto=webp&s=633eebc63d6cfafc30d4975abc82114fa41ea201',
            },
            votes: 45000,
            url: 'https://www.reddit.com/r/funny/comments/m6fp40/i_guess_we_have_a_new_appliance/',
          },
        ],
        notfunny: [
          {
            title: 'title3',
            votes: 780000,
            url: 'https://www.reddit.com/r/funny/comments/m6fp40/i_guess_we_have_a_new_appliance/',
          },
        ],
      },
    })

    // preview html
    fs.writeFileSync(path.join(__dirname, 'newsletter.html'), html)
    expect(html).toMatchSnapshot()
  })
})
