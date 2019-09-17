import requests,json,os
d=json.load(open('./am270.json'))
for k in d['textures']:
    filename=d['textures'][k]['url'].lstrip('/')
    filepath='/'.join(filename.split('/')[:-1])
    print(filepath)
    if not os.path.exists(filepath):
        os.mkdir(filepath)
    with open(filename,'wb') as f:
        data=requests.get('https://nikebyyou.nike.com/psychedbyyou//content/am270/'+filename).content
        f.write(data)
