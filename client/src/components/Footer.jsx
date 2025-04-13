import { Footer, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup, FooterTitle } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function FooterComp() {
  return (
   <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'> 
                <div mt-5>
                    <Link to={'/'} className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                                     rounded-lg text-white'>Brain</span>
                                     Storming
                    </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                    <FooterTitle title='Најнови вести'/>
                    <FooterLinkGroup col>
                        <FooterLink href='https://www.time.mk'
                                    target='_blank'
                                    rel='noopener noreferrer'>Вести од земјата                      
                        </FooterLink>
                        <FooterLink href='https://www.nytimes.com/'
                                    target='_blank'
                                    rel='noopener noreferrer'>Вести од светот                      
                        </FooterLink>
                    </FooterLinkGroup>         
                    </div>   
                    <div>
                    <FooterTitle title='Контакт информации'/>
                    <FooterLinkGroup col>
                        <FooterLink href='https://fzo.org.mk/dezurni-apteki'
                                    target='_blank'
                                    rel='noopener noreferrer'>Дежурни аптеки                      
                        </FooterLink>
                        <FooterLink href='https://amsm.mk/sostojba-na-patishta/pomosh-na-pat/'
                                    target='_blank'
                                    rel='noopener noreferrer'>Помош на пат                      
                        </FooterLink>
                    </FooterLinkGroup>         
                    </div>     
                    <div>
                    <FooterTitle title='Курсна листа'/>
                    <FooterLinkGroup col>
                        <FooterLink href='https://www.nbrm.mk/kursna_lista.nspx'
                                    target='_blank'
                                    rel='noopener noreferrer'>НБРМ                      
                        </FooterLink>
                        <FooterLink href='https://www.binance.com/en/markets/overview'
                                    target='_blank'
                                    rel='noopener noreferrer'>Крипто берза                      
                        </FooterLink>
                    </FooterLinkGroup>         
                    </div>                              
                </div>
            </div>
            <FooterDivider />
            <div className='w-full items-center justify-between'>
                <FooterCopyright href='#' by="StormIT Solutions" year={new Date().getFullYear()}/>
            </div>
        </div>
   </Footer>
  )
}
