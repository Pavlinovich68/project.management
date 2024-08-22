'use client'
import React, { useRef, useState } from "react";
import {$app_variables} from "@/app.variables";
import { Image } from 'primereact/image';
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import styles from './styles.module.scss';
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { Divider } from "primereact/divider";

const RestorePassword = ({params}: {params: {id: number, token: string}}) => {

   const regex = new RegExp('^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$');
   const toast = useRef<Toast>(null);
   const [password, setPassword] = useState<string>();
   const [rePassword, setRePassword] = useState<string>();
   const router = useRouter();
   const [strong, setStrong] = useState<boolean>(false);

   const header = <div className="font-bold mb-3">Pick a password</div>;
   const footer = (
      <>
         <Divider />
         <p className="mt-2">Suggestions</p>
         <ul className="pl-2 ml-2 mt-0 line-height-3">
               <li>At least one lowercase</li>
               <li>At least one uppercase</li>
               <li>At least one numeric</li>
               <li>Minimum 8 characters</li>
         </ul>
      </>
   );

   const reset = async () => {
      if (password !== rePassword) {
         //@ts-ignore
         toast.current.show({
            severity:'error',
            summary: 'Ошибка',
            detail: 'Пароли не совпадают',
            life: 5000
         });
         setPassword('');
         setRePassword('');
         return;
      }

      const res = await fetch(`/api/users/restore2`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({id: params.id, token: params.token, password: password}),
      });
      const result = await res.json();
      console.log(result);
      //@ts-ignore
      await toast.current.show({
         severity: result.bad ? 'error' : 'success',
         summary: result.bad ? 'Ошибка' : 'Выполнено',
         detail: result.note,
         life: 5000
      });
      if (!result.bad)
         router?.push("/login/")
   }
   
   return (
      <React.Fragment>
         <div className={classNames(styles.container)}>
            <div className={classNames(styles.contentCell, 'card flex flex-column')}>
               <div className="flex justify-content-center mb-0">
                  <Image src={'/layout/images/logo.svg'} alt ="" width="60"/>               
               </div>
               <div className="flex justify-content-center mt-1 text-xl">{$app_variables.TITLE}</div>
               <div className="flex justify-content-center mt-1 text-lg">Восстановление пароля</div>
               <span className={classNames("field pl-3 pr-3 mt-3 p-float-label", styles.passInput)}>               
                  <Password
                     inputId="pass"
                     inputClassName="w-full"
                     strongRegex={regex.source}
                     className="w-full"
                     toggleMask
                     value={password}
                     onChange={(e) => {
                        setStrong(regex.test(e.target.value));
                        setPassword(e.target.value);
                     }}
                     header={header}
                     footer={footer}
                     weakLabel="Пароль слишком слабый"
                     strongLabel="!!!!"
                     required type="text"/>
                     <label className={classNames(styles.passLabel)} htmlFor="pass">Укажите новый пароль</label>
               </span>
               <span className={classNames("field pl-3 pr-3 mt-3 p-float-label", styles.passInput)}>               
                  <Password
                     inputId="rePass"
                     inputClassName="w-full"
                     className="w-full"
                     toggleMask
                     value={rePassword}
                     onChange={(e) => setRePassword(e.target.value)}
                     required type="text"
                     feedback={false}/>
                     <label className={classNames(styles.passLabel)} htmlFor="rePass">Повторите пароль</label>
               </span>
               <div className={classNames("flex justify-content-center", styles.sendButton)}>
                     <Button disabled={!(!!password && !!rePassword && strong && (password === rePassword))} type="button" severity="danger" onClick={() => reset()}>Обновить</Button>
               </div>
            </div>         
         </div>
         <Toast ref={toast} />
      </React.Fragment>
   );
};

export default RestorePassword;
