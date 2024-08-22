/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {$app_variables} from "@/app.variables";
import {signIn, useSession} from "next-auth/react";
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';



const LoginPage = () => {
   const [data, setData] = useState({
      name: '',
      email: '',
      password: '',
   })
   const [email, setEmail] = useState();
   const [formState, setFormState] = useState(false);
   const session = useSession();
   const router = useRouter();

   //if (session.status !== "authenticated") return;
   useEffect(()=> {if (session.status == "authenticated"){
      router?.push("/")
   }})



   const handleSubmit = async (e) => {
      e.preventDefault();
      signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: false,
      });
      router?.push("/");
   }

   const restorePassword = async () => {
      await fetch(`/api/users/restore`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({email: email}),
      });
   }

   const loginForm = (
      <div className={classNames(formState ? 'itr-login-form itr-right-panel-active' : 'itr-login-form')}>
         <div className="itr-form-container itr-sign-up-container">
               <form action="#">
                  <h1>Восстановление пароля</h1>
                  <input type="email" placeholder="Адрес электронной почты" value={email} onChange={e => setEmail(e.target.value)}/>
                  <button disabled={!email} onClick={() => restorePassword()}>Отправить</button>
               </form>
         </div>
         <div className="itr-form-container itr-sign-in-container">
               <form action="#" onSubmit={handleSubmit}>
                  <h1>Вход в систему</h1>
                  <input type="email" placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})}/>
                  <input type="password" placeholder="Password" value={data.password} onChange={e => setData({...data, password: e.target.value})}/>
                  <button disabled={!data.email || !data.password} type='submit'>Войти</button>
               </form>
         </div>
         <div className="itr-overlay-container">
               <div className="itr-overlay">
                  <div className="itr-overlay-panel itr-overlay-left">
                     <img src={'/layout/images/logo.svg'} alt =""/>
                     <h1>{$app_variables.TITLE}</h1>
                     <p>На указанный адрес электронной почты будет выслано письмо со ссылкой на форму восстановления пароля</p>
                     <button className="itr-ghost" id="signIn" onClick={() => setFormState(false)}>Войти в систему</button>
                  </div>
                  <div className="itr-overlay-panel itr-overlay-right">
                     <img src={'/layout/images/logo.svg'} alt =""/>
                     <h1>{$app_variables.TITLE}</h1>
                     <p>Для входа в систему введите адрес электронной почты и пароль</p>
                     <button className="itr-ghost" id="signUp" onClick={() => setFormState(true)}>Восстановить пароль</button>
                  </div>
               </div>
         </div>
      </div>
   );

   const spiner = (
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )


   return (
      <React.Fragment>
            <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
               {session.status !== "authenticated" ? loginForm : spiner }
            </div>
      </React.Fragment>
   );
};

export default LoginPage;
