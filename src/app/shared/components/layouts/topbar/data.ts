const aws = '/assets/images/brands/aws.svg'
const bitbucket = '/assets/images/brands/bitbucket.svg'
const bootstrap = '/assets/images/brands/bootstrap.svg'
const digitalOcean = '/assets/images/brands/digital-ocean.svg'
const dribbble = '/assets/images/brands/dribbble.svg'
const dropbox = '/assets/images/brands/dropbox.svg'
const gitlab = '/assets/images/brands/gitlab.svg'
const googleCloud = '/assets/images/brands/google-cloud.svg'
const slack = '/assets/images/brands/slack.svg'

export type AppsType = {
  name: string
  image: string
}

export const appData: AppsType[] = [
  {
    name: 'slack',
    image: slack,
  },
  {
    name: 'Gitlab',
    image: gitlab,
  },
  {
    name: 'Dribbble',
    image: dribbble,
  },
  {
    name: 'Bitbucket',
    image: bitbucket,
  },
  {
    name: 'Dropbox',
    image: dropbox,
  },
  {
    name: 'G Cloud',
    image: googleCloud,
  },
  {
    name: 'AWS',
    image: aws,
  },
  {
    name: 'Server',
    image: digitalOcean,
  },
  {
    name: 'Bootstrap',
    image: bootstrap,
  },
]

