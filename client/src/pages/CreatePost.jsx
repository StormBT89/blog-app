import { TextInput, Select, FileInput, Button, Textarea } from 'flowbite-react'


export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my=7 font-semibold mb-4">Креирај нов состанок</h1>        
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' id='title' placeholder='Наслов на состанокот..' required className='flex-1' />
            <Select>
              <option value='kolegijalen'>Колегиум</option>
              <option value='nedelen'>Неделен</option>
              <option value='iten'>Итен</option>
              <option value='mesecen'>Месечен</option>
            </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*'/>
          <Button type='button' size='sm' className='bg-gradient-to-r from-white-200 via-gray-500 to-black-500'>
            Прикачи фотографија
          </Button>
        </div>     
        <Textarea id='content' placeholder='Инфо за состанок..' required rows={5}>
        </Textarea>
        <Button type='submit' className='bg-gradient-to-r from-white-200 via-gray-500 to-black-500'>
          Поднеси
        </Button>
      </form>         
    </div>
  )
}
